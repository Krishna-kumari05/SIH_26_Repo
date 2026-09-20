import { useRef, useState } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  FileOutput,
  Link as LinkIcon,
  Sparkles,
  FileText,
  Trash2,
} from "lucide-react";
import { useChat } from "../context/ChatContext";

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
  const { ragSources, addRagSource, removeRagSource } = useChat();
  const fileInputRef = useRef(null);
  // Which single card is currently selected — null means none yet.
  const [selectedOption, setSelectedOption] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) addRagSource(file);
    e.target.value = "";
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
              >
                <span className="rag-card__icon">
                  <Icon size={20} />
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
            {ragSources.length === 0
              ? "No sources added yet"
              : `${ragSources.length} source(s)`}
          </div>
          <div className="rag-list">
            {ragSources.map((source) => (
              <div key={source.id} className="rag-list__item">
                <FileText size={15} />
                <span className="rag-list__name">{source.name}</span>
                <button
                  className="icon-btn"
                  onClick={() => removeRagSource(source.id)}
                  aria-label={`Remove ${source.name}`}
                >
                  <Trash2 size={14} />
                </button>
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
