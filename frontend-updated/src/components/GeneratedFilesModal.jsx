import { X, FileOutput, Download, Loader2 } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { downloadGeneratedFile } from "../services/api";
import { useState } from "react";

export default function GeneratedFilesModal({ onClose }) {
  const { generatedFiles } = useChat();
  const [downloading, setDownloading] = useState({});

  async function handleDownload(jobId, filename) {
    setDownloading((prev) => ({ ...prev, [jobId]: true }));
    try {
      const response = await downloadGeneratedFile(jobId);
      if (!response.ok) throw new Error("Failed to download file");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename || "download";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download: " + err.message);
    } finally {
      setDownloading((prev) => ({ ...prev, [jobId]: false }));
    }
  }

  return (
    <div className="search-modal__backdrop" onClick={onClose}>
      <div className="settings-modal settings-modal--dashboard" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal__header">
          <span>Generated files</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {generatedFiles.length === 0 ? (
          <p className="chat-sidebar__empty">
            Your all generated Files
          </p>
        ) : (
          <div className="rag-list">
            {generatedFiles.map((file) => (
              <div key={file.id} className="rag-list__item">
                <FileOutput size={15} />
                <span className="rag-list__name">{file.name}</span>
                <button
                  className="icon-btn"
                  onClick={() => handleDownload(file.jobId, file.name)}
                  aria-label={`Download ${file.name}`}
                  disabled={downloading[file.jobId]}
                >
                  {downloading[file.jobId] ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Download size={14} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
