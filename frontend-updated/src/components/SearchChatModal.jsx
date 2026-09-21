import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { searchChats } from "../services/api";

export default function SearchChatModal({ onClose }) {
  const { selectChat } = useChat();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchChats(query);
        setResults(data || []);
      } catch (err) {
        console.error("Failed to search chats:", err);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(id) {
    selectChat(id);
    onClose();
  }

  return (
    <div className="search-modal__backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal__input-row">
          <Search size={16} />
          <input
            autoFocus
            className="search-modal__input"
            placeholder="Search chats by prompt..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 size={16} className="animate-spin" style={{marginRight: 8}}/>}
          <button className="icon-btn" onClick={onClose} aria-label="Close search">
            <X size={16} />
          </button>
        </div>

        <div className="search-modal__results">
          {!query.trim() && (
            <p className="chat-sidebar__empty">Type to search past conversations.</p>
          )}
          {query.trim() && !loading && results.length === 0 && (
            <p className="chat-sidebar__empty">No chats match "{query}".</p>
          )}
          {results.map((c) => (
            <button
              key={c.jobId}
              className="search-modal__result"
              onClick={() => handleSelect(c.jobId)}
            >
              {c.promptSnippet}
              <div style={{fontSize: "0.75rem", opacity: 0.6}}>{c.taskType} • {new Date(c.createdAt).toLocaleDateString()}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
