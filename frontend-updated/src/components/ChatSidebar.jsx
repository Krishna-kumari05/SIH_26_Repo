import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  PanelLeft,
  SquarePen,
  Search,
  Settings,
  FileSearch,
  Files,
} from "lucide-react";
import { useChat } from "../context/ChatContext";
import SearchChatModal from "./SearchChatModal";
import SettingsModal from "./SettingsModal";
import RagModal from "./RagModal";
import GeneratedFilesModal from "./GeneratedFilesModal";

export default function ChatSidebar() {
  const {
    sidebarOpen,
    setSidebarOpen,
    startNewChat,
    conversations,
    activeConversation,
    selectChat,
  } = useChat();
  const [searchOpen, setSearchOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!sidebarOpen) return;

    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  return (
   <>
      <motion.div
        ref={sidebarRef}
        className="chat-sidebar-shell"
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 64 }}
        transition={{ type: "spring", stiffness: 300, damping: 34 }}
      >
      <AnimatePresence initial={false}>
      {sidebarOpen ? (
        <motion.aside
          key="expanded"
          className="chat-sidebar chat-sidebar--expanded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.08 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
          <div className="chat-sidebar__header">
            <button
              className="icon-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Collapse sidebar"
            >
              <PanelLeft size={18} />
            </button>
            <span className="chat-sidebar__brand">SOVEREIGN AI</span>
          </div>

          <button className="chat-sidebar__nav-item" onClick={startNewChat}>
            <SquarePen size={16} />
            New chat
          </button>
          <button
            className="chat-sidebar__nav-item"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={16} />
            Search chat
          </button>

          <div className="chat-sidebar__section-label">Recent Chat</div>
          <div className="chat-sidebar__list">
            {conversations.length === 0 && (
              <p className="chat-sidebar__empty">No conversations yet.</p>
            )}
            {conversations.map((c) => (
              <button
                key={c.id}
                className={
                  "chat-sidebar__chat-item" +
                  (activeConversation?.id === c.id ? " chat-sidebar__chat-item--active" : "")
                }
                onClick={() => selectChat(c.id)}
              >
                {c.title}
              </button>
            ))}
          </div>

          <ChatSidebarFooter expanded />
        </motion.aside>
      ) : (
        <motion.div
          key="rail"
          className="chat-rail"
          onClick={() => setSidebarOpen(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.08 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
          <button
            className="icon-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Expand sidebar"
          >
            <PanelLeft size={20} />
          </button>
          <button className="icon-btn" onClick={startNewChat} aria-label="New chat">
            <SquarePen size={20} />
          </button>
          <button
            className="icon-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Search chat"
          >
            <Search size={20} />
          </button>

          <div className="chat-rail__spacer" />

          <ChatSidebarFooter expanded={false} />
        </motion.div>
      )}
      </AnimatePresence>
      </motion.div>

      {searchOpen && <SearchChatModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
function ChatSidebarFooter({ expanded }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ragOpen, setRagOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);

  return (
    <div className={expanded ? "chat-sidebar__footer" : "chat-rail__footer"}>
      <button
        className={expanded ? "chat-sidebar__nav-item" : "icon-btn"}
        onClick={() => setSettingsOpen(true)}
      >
        <Settings size={expanded ? 16 : 20} />
        {expanded && "Setting"}
      </button>

      <button
        className={expanded ? "chat-sidebar__nav-item" : "icon-btn"}
        onClick={() => setRagOpen(true)}
      >
        <FileSearch size={expanded ? 16 : 20} />
        {expanded && "RAG"}
      </button>

      <button
        className={expanded ? "chat-sidebar__nav-item" : "icon-btn"}
        onClick={() => setFilesOpen(true)}
      >
        <Files size={expanded ? 16 : 20} />
        {expanded && "Generated files"}
      </button>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
      {ragOpen && <RagModal onClose={() => setRagOpen(false)} />}
      {filesOpen && <GeneratedFilesModal onClose={() => setFilesOpen(false)} />}
    </div>
  );
}
