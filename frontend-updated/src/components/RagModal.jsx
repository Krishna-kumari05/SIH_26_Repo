import { useRef, useState, useEffect } from "react";
import {
  X,
  Upload,
  Link as LinkIcon,
  FileText,
  Trash2,
  Loader2,
} from "lucide-react";
import { useChat } from "../context/ChatContext";
import { uploadDocument, ragIngest, getIndexedDocuments } from "../services/api";

const RAG_CARDS = [
  {
    id: "upload-file",
    title: "Upload a file",
    description: "Add a document as a knowledge source.",
    icon: Upload,
  },
  {
    id: "website-link",
    title: "Website Link",
    description: "Add a webpage as a knowledge source.",
    icon: LinkIcon,
  },
];

export default function RagModal({ onClose }) {
  const { ragSources, removeRagSource } = useChat();
  const fileInputRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Real backend indexed docs
  const [indexedDocs, setIndexedDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  async function loadDocs() {
    setLoadingDocs(true);
    try {
      const docs = await getIndexedDocuments();
      setIndexedDocs(docs || []);
    } catch (err) {
      console.error("Failed to load indexed docs:", err);
    } finally {
      setLoadingDocs(false);
    }
  }

  useEffect(() => {
    loadDocs();
  }, []);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      // 1. Upload to storage
      const uploadedDoc = await uploadDocument(file);
      // 2. Queue RAG ingestion
      await ragIngest(uploadedDoc.id);
      
      // Reload the list of indexed docs
      await loadDocs();
    } catch (err) {
      console.error("Failed to ingest file:", err);
      alert("Failed to ingest file: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleCardClick(card) {
    setSelectedOption(card.id);
    if (card.id === "upload-file") {
      fileInputRef.current?.click();
    }
  }

  return (
    <div className="search-modal__backdrop" onClick={onClose}>
      <div
        className="settings-modal settings-modal--dashboard rag-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-modal__header">
          <span>RAG sources</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="rag-cards-grid">
          {RAG_CARDS.map((card) => {
            const Icon = card.icon;
            const isActive = selectedOption === card.id;
            return (
              <button
                key={card.id}
                className={"rag-card" + (isActive ? " rag-card--active" : "")}
                onClick={() => handleCardClick(card)}
                disabled={uploading}
              >
                <span className="rag-card__icon">
                  {uploading && card.id === "upload-file" ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Icon size={20} />
                  )}
                </span>
                <span className="rag-card__title">{card.title}</span>
                <span className="rag-card__desc">{card.description}</span>
              </button>
            );
          })}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div className="settings-section">
          <div className="settings-section__label">
            {loadingDocs ? (
               <span><Loader2 size={12} className="animate-spin" style={{display: 'inline-block'}}/> Loading...</span>
            ) : indexedDocs.length === 0 ? (
              "No sources added yet"
            ) : (
              `${indexedDocs.length} source(s) indexed`
            )}
          </div>
          <div className="rag-list">
            {indexedDocs.map((doc) => (
              <div key={doc.id} className="rag-list__item">
                <FileText size={15} />
                <span className="rag-list__name">{doc.originalFilename}</span>
                {/* Could add a delete endpoint later if backend supports it */}
              </div>
            ))}
          </div>
        </div>

        <p className="stats-popover__note">
        </p>
      </div>
    </div>
  );
}
