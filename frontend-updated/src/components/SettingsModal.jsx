import { useState } from "react";
import { X, Monitor, Trash2, UserRound, Mail, Phone } from "lucide-react";
import { useTextSize } from "../context/TextSizeContext";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";

const SIZE_OPTIONS = [
  { key: "small", label: "Small" },
  { key: "medium", label: "Medium" },
  { key: "large", label: "Large" },
];

export default function SettingsModal({ onClose }) {
  const { user } = useUser();
  const { size, setSize } = useTextSize();
  const { clearAllConversations, conversations } = useChat();
  const [confirmingClear, setConfirmingClear] = useState(false);

  function handleClearConfirmed() {
    clearAllConversations();
    setConfirmingClear(false);
  }

  return (
    <div className="search-modal__backdrop" onClick={onClose}>
      <div className="settings-modal settings-modal--dashboard" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal__header">
          <span>Settings</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">
            <X size={16} />
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-section__label">Account</div>
          <div className="profile-modal__row">
            <UserRound size={16} />
            <span>{user?.username || "Unknown"}</span>
          </div>
          <div className="profile-modal__row">
            <Mail size={16} />
            <span>{user?.email || "Not available"}</span>
          </div>
          <div className="profile-modal__row">
            <Phone size={16} />
            <span>{user?.phone || "Not added"}</span>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section__label">Theme</div>
          <div className="settings-option settings-option--active settings-option--static">
            <Monitor size={15} />
            System 
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section__label">Message text size</div>
          <div className="settings-options">
            {SIZE_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                className={
                  "settings-option" + (size === key ? " settings-option--active" : "")
                }
                onClick={() => setSize(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section__label">Data</div>
          {!confirmingClear ? (
            <button
              className="settings-option settings-option--danger"
              onClick={() => setConfirmingClear(true)}
              disabled={conversations.length === 0}
            >
              <Trash2 size={15} />
              Clear all conversations
            </button>
          ) : (
            <div className="settings-confirm">
              <span>Delete all {conversations.length} conversation(s)? This can't be undone.</span>
              <div className="settings-confirm__actions">
                <button className="settings-option" onClick={() => setConfirmingClear(false)}>
                  Cancel
                </button>
                <button className="settings-option settings-option--danger" onClick={handleClearConfirmed}>
                  Delete all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
