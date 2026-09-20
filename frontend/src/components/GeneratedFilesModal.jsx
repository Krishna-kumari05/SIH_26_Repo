import { X, FileOutput, Download } from "lucide-react";
import { useChat } from "../context/ChatContext";


export default function GeneratedFilesModal({ onClose }) {
  const { generatedFiles } = useChat();

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
                <a
                  className="icon-btn"
                  href={file.url}
                  download
                  aria-label={`Download ${file.name}`}
                >
                  <Download size={14} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
