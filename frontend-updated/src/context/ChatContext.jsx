import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  sendChatMessage,
  getAIJob,
  newChat,
  getChatHistory,
  getSelectedModel,
  selectModel,
  getGeneratedFiles,
} from "../services/api";
import { MODEL_OPTIONS } from "../components/ModelMenu";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [engaged, setEngaged] = useState(false);

  // Active model — initialised from first MODEL_OPTIONS entry, then
  // synced with backend on mount.
  const [selectedModelId, setSelectedModelIdLocal] = useState(MODEL_OPTIONS[0].id);

  // The tool the user selected from the Tools panel.
  // Value is a backend taskType string (e.g. "DOCUMENT_ANALYSER") or null.
  const [activeTaskType, setActiveTaskType] = useState(null);

  // RAG sources shown in the RAG modal (local display list).
  const [ragSources, setRagSources] = useState([]);

  // Files the assistant has generated — fetched from the backend.
  const [generatedFiles, setGeneratedFiles] = useState([]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  // On mount: load chat history, selected model, generated files 
  useEffect(() => {
    async function bootstrap() {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      // Load chat history to populate the sidebar
      try {
        const history = await getChatHistory();
        if (Array.isArray(history) && history.length > 0) {
          const mapped = history.map((job) => ({
            id: job.id,
            title:
              job.prompt && job.prompt.length > 40
                ? job.prompt.slice(0, 40) + "…"
                : job.prompt || `Job #${job.id}`,
            messages: [
              { role: "user", text: job.prompt || "" },
              ...(job.result
                ? [{ role: "assistant", text: job.result }]
                : []),
            ],
          }));
          setConversations(mapped);
        }
      } catch (err) {
        console.warn("Could not load chat history:", err);
      }

      // Sync the selected model from the backend
      try {
        const modelData = await getSelectedModel();
        if (modelData?.selectedModel) {
          setSelectedModelIdLocal(modelData.selectedModel);
        }
      } catch (err) {
        console.warn("Could not load selected model:", err);
      }

      // Pre-load generated files
      try {
        const files = await getGeneratedFiles();
        if (Array.isArray(files)) {
          setGeneratedFiles(files);
        }
      } catch (err) {
        console.warn("Could not load generated files:", err);
      }
    }

    bootstrap();
  }, []);

  // Model selection — persists to backend
  async function setSelectedModelId(modelId) {
    setSelectedModelIdLocal(modelId);
    try {
      await selectModel(modelId);
    } catch (err) {
      console.warn("Failed to persist model selection:", err);
    }
  }

  
  async function startNewChat() {
    setActiveId(null);
    setEngaged(false);
    setActiveTaskType(null);
    try {
      await newChat();
    } catch (err) {
      console.warn("newChat API call failed (non-blocking):", err);
    }
  }

  function selectChat(id) {
    setActiveId(id);
    setEngaged(true);
  }

  function clearAllConversations() {
    setConversations([]);
    setActiveId(null);
    setEngaged(false);
  }
  function addRagSource(file) {
    setRagSources((prev) => [
      { id: `${Date.now()}-${file.name}`, name: file.name, size: file.size },
      ...prev,
    ]);
  }

  function removeRagSource(id) {
    setRagSources((prev) => prev.filter((s) => s.id !== id));
  }

  // Called when a backend job produces a file — pushes it into the list.
  const addGeneratedFile = useCallback((fileData) => {
    setGeneratedFiles((prev) => [fileData, ...prev]);
  }, []);

  function appendMessage(conversationId, message) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message] }
          : c
      )
    );
  }

  async function waitForJob(jobId) {
    const maxAttempts = 60;
    const delay = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const job = await getAIJob(jobId);

      if (job.status === "COMPLETED") {
        return job;
      }
      if (job.status === "FAILED") {
        throw new Error(job.errorMessage || "AI job failed.");
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    throw new Error("AI response timed out.");
  }

  async function sendMessage(text, documentId = null) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setEngaged(true);

    // Determine task type: selected tool → doc chat → plain chat
    const taskType =
      activeTaskType ||
      (documentId ? "DOCUMENT_CHAT" : "CHAT");

    // Optimistic: create a new conversation entry keyed by a temp id
    const tempId = `temp-${Date.now()}`;
    let conversationId = activeId;

    if (!conversationId) {
      const title = trimmed.length > 40 ? trimmed.slice(0, 40) + "…" : trimmed;
      setConversations((prev) => [
        { id: tempId, title, messages: [] },
        ...prev,
      ]);
      setActiveId(tempId);
      conversationId = tempId;
    }

    appendMessage(conversationId, { role: "user", text: trimmed });

    setSending(true);
    try {
      const job = await sendChatMessage({ text: trimmed, documentId, taskType });

      // Replace temp id with real backend job id
      if (conversationId === tempId) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === tempId ? { ...c, id: job.id } : c
          )
        );
        setActiveId(job.id);
        conversationId = job.id;
      }

      const completedJob = await waitForJob(job.id);

      appendMessage(conversationId, {
        role: "assistant",
        text: completedJob.result || "No response generated.",
      });

      // If this job produced a file, push it into generatedFiles
      if (completedJob.resultFileName) {
        addGeneratedFile({
          id: completedJob.id,
          jobId: completedJob.id,
          name: completedJob.resultFileName,
          fileType: completedJob.resultFileType,
        });
      }

      // Clear tool selection after message is sent
      setActiveTaskType(null);
    } catch {
      appendMessage(conversationId, {
        role: "assistant",
        text: "⚠️ Could not get a response. Please check your connection.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        startNewChat,
        selectChat,
        clearAllConversations,
        sendMessage,
        sending,
        sidebarOpen,
        setSidebarOpen,
        engaged,
        setEngaged,
        selectedModelId,
        setSelectedModelId,
        activeTaskType,
        setActiveTaskType,
        ragSources,
        addRagSource,
        removeRagSource,
        generatedFiles,
        setGeneratedFiles,
        addGeneratedFile,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
