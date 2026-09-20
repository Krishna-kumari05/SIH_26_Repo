import { createContext, useContext, useState } from "react";
import { sendChatMessage } from "../services/api";
import { MODEL_OPTIONS } from "../components/ModelMenu";

const ChatContext = createContext(null);

let nextId = 1;   // just for testing , need to change, conversationId must be returned by teh backend

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);  
  const [sending, setSending] = useState(false);
  const [engaged, setEngaged] = useState(false);  //tells when the ask question menu need to go down
  const [selectedModelId, setSelectedModelId] = useState(MODEL_OPTIONS[0].id);

  // RAG sources: documents the user has added as context for the
  // assistant to reference. Frontend-only for now — the actual
  // file contents go nowhere yet; a real RAG pipeline needs a
  // backend endpoint to upload, chunk/embed, and store these.
  const [ragSources, setRagSources] = useState([]);

  // Files the ASSISTANT generates during a chat (e.g. "here's your
  // report as a .docx"). Always empty right now — nothing in this
  // frontend-only build can generate a real file. Once a backend
  // exists, whatever sendMessage()'s reply includes (a fileUrl,
  // say) should get pushed in here via addGeneratedFile.
  const [generatedFiles, setGeneratedFiles] = useState([]);

  // Which tools (from the Tools panel) are currently toggled on.
  const [enabledTools, setEnabledTools] = useState([]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  function startNewChat() {   // the newchat function
    setActiveId(null);
    setEngaged(false);
  }

  function selectChat(id) {    // serach and select an existing function 
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

  // Not called anywhere yet — this is the hook point for when a
  // backend response includes a generated file.
  function addGeneratedFile({ name, url, conversationId }) {
    setGeneratedFiles((prev) => [
      { id: `${Date.now()}-${name}`, name, url, conversationId },
      ...prev,
    ]);
  }

  function toggleTool(id) {
    setEnabledTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  function appendMessage(conversationId, message) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c
      )
    );
  }



  
      //NEED BACKEND RESPONSE

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setEngaged(true);

    let conversationId = activeId;

    if (!conversationId) {
      conversationId = nextId++;     // MUST BEE UPDATED USING THE BACKEND 
      const title = trimmed.length > 40 ? trimmed.slice(0, 40) + "…" : trimmed;
      setConversations((prev) => [
        { id: conversationId, title, messages: [] },
        ...prev,
      ]);
      setActiveId(conversationId);
    }

    appendMessage(conversationId, { role: "user", text: trimmed });



      
    setSending(true);
    try {
      const reply = await sendChatMessage({ conversationId, text: trimmed });     //NEED BACKEND REPLY
      appendMessage(conversationId, { role: "assistant", text: reply.text });
    } catch {
      appendMessage(conversationId, {
        role: "assistant",
        text: "(Backend isn't connected yet )",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <ChatContext.Provider    //AVAILABLE TO CHILD COMPONENTS
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
        ragSources,
        addRagSource,
        removeRagSource,
        generatedFiles,
        addGeneratedFile,
        enabledTools,
        toggleTool,
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
