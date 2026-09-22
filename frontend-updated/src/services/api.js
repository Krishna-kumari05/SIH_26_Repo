
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";


async function request(
  endpoint,
  {
    method = "POST",
    body,
    token,
    headers: customHeaders,
    isFormData = false,
  } = {}
) {
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...customHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: isFormData
      ? body
      : body
        ? JSON.stringify(body)
        : undefined,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}


export function signup({ username, email, password, phone }) {
  return request("/auth/signup", {
    body: { username, email, password, phone },
  });
}

export function login({ email, password }) {
  return request("/auth/login", {
    body: { email, password },
  });
}

export function verifyOtp({ email, otp }) {
  return request("/auth/verify-signup", {
    body: { email, otp },
  });
}

export function verifyLogin({ email, otp, deviceId, deviceName, platform }) {
  return request("/auth/verify-login", {
    body: { email, otp },
    headers: {
      "X-Device-Id": deviceId,
      "X-Device-Name": deviceName,
      "X-Platform": platform,
    },
  });
}

export function resendOtp({ email }) {
  return request("/auth/resend-signup-otp", {
    body: { email },
  });
}

export function googleAuth({ accessToken }) {
  return request("/auth/google", {
    body: { accessToken },
  });
}


export function getCurrentUser() {
  const token = localStorage.getItem("authToken");
  return request("/user/me", { method: "GET", token });
}

export function uploadDocument(file) {
  const token = localStorage.getItem("authToken");
  const formData = new FormData();
  formData.append("file", file);
  return request("/documents/upload", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
}


export function sendChatMessage({ text, documentId = null, taskType = "CHAT" }) {
  const token = localStorage.getItem("authToken");
  return request("/chat/message", {
    body: {
      prompt: text,
      documentId,
      taskType: taskType || (documentId ? "DOCUMENT_CHAT" : "CHAT"),
    },
    token,
  });
}

export function newChat() {
  const token = localStorage.getItem("authToken");
  return request("/chat/new", { method: "POST", token });
}

export function getChatHistory() {
  const token = localStorage.getItem("authToken");
  return request("/chat/history", { method: "GET", token });
}

export function searchChats(q) {
  const token = localStorage.getItem("authToken");
  return request(`/chat/search?q=${encodeURIComponent(q)}`, {
    method: "GET",
    token,
  });
}

export function getAIJob(jobId) {
  const token = localStorage.getItem("authToken");
  return request(`/ai/jobs/${jobId}`, { method: "GET", token });
}

// Returns the full tool catalogue (grouped by category).
export function getToolCatalogue() {
  const token = localStorage.getItem("authToken");
  return request("/tools", { method: "GET", token });
}

/**
 * Queue a job for a specific tool.
 * @param {object} params
 * @param {string} params.taskType  - e.g. "DOCUMENT_ANALYSER"
 * @param {string} params.prompt    - the user's message
 * @param {number} [params.documentId] - optional attached document
 */
export function runTool({ taskType, prompt, documentId = null }) {
  const token = localStorage.getItem("authToken");
  return request("/tools/run", {
    body: { taskType, prompt, documentId },
    token,
  });
}


export function getSelectedModel() {
  const token = localStorage.getItem("authToken");
  return request("/model/selected", { method: "GET", token });
}

export function selectModel(model) {
  const token = localStorage.getItem("authToken");
  return request("/model/select", {
    method: "PUT",
    body: { model },
    token,
  });
}


//List all AI jobs that produced a downloadable file.
export function getGeneratedFiles() {
  const token = localStorage.getItem("authToken");
  return request("/generated-files", { method: "GET", token });
}

export function downloadGeneratedFile(jobId) {
  const token = localStorage.getItem("authToken");
  return fetch(`${API_BASE_URL}/generated-files/${jobId}/download`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

//Submit a document for RAG indexing (queues a RAG_INGEST job).
export function ragIngest(documentId) {
  const token = localStorage.getItem("authToken");
  return request("/rag/ingest", { body: { documentId }, token });
}

//Run a retrieval-augmented query (queues a RAG_QUERY job).
export function ragQuery({ query, documentId = null }) {
  const token = localStorage.getItem("authToken");
  return request("/rag/query", {
    body: { query, documentId },
    token,
  });
}

//List all documents that have been submitted for RAG indexing.
export function getIndexedDocuments() {
  const token = localStorage.getItem("authToken");
  return request("/rag/documents", { method: "GET", token });
}

export function getSystemStats() {
  return request("/system/stats", { method: "GET" });
}

export function requestPasswordReset({ email }) {
  return request("/auth/forgot-password", {
    body: { email },
  });
}

export function verifyResetOtp({ email, otp }) {
  return request("/auth/verify-reset-otp", {
    body: { email, otp },
  });
}

export function resetPassword({ email, resetToken, newPassword }) {
  return request("/auth/reset-password", {
    body: {
      email,
      resetToken,
      newPassword,
    },
  });
}