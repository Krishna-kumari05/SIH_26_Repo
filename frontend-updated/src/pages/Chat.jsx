import { useEffect, useRef } from "react";
import StarsBackground from "../components/StarsBackground";
import ChatSidebar from "../components/ChatSidebar";
import ChatComposer from "../components/ChatComposer";
import TopStatsBar from "../components/TopStatsBar";
import ToolsButton from "../components/ToolsButton";
import { useChat } from "../context/ChatContext";
import { AnimatePresence, motion } from "motion/react";

export default function Chat() {
  const { activeConversation, sidebarOpen, engaged, setEngaged } = useChat();

  const showWelcome = !activeConversation && !engaged;
  const atBottom = engaged || !!activeConversation;
  const composerWrapRef = useRef(null);     //helping to know , user clicked where ,inside or outside the menu

  useEffect(() => {
    if (!engaged || activeConversation) return;

    function handleOutsideMouseDown(e) {
      if (composerWrapRef.current && !composerWrapRef.current.contains(e.target)) {
        setEngaged(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideMouseDown);
    return () => document.removeEventListener("mousedown", handleOutsideMouseDown);
  }, [engaged, activeConversation, setEngaged]);

  return (
    <div className="chat-page">
      {}
      {!atBottom && <StarsBackground starColor="#fff" speed={60} factor={0.06} />}
      <TopStatsBar />
      <ToolsButton />
      <ChatSidebar />

      
      <main
        className={
          "chat-main" +
          (sidebarOpen ? " chat-main--with-sidebar" : "") +
          (atBottom ? " chat-main--bottom" : "")
        }
      >
        <AnimatePresence mode="popLayout">
          {showWelcome && (
            <motion.div
              key="welcome"
              className="chat-welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="chat-welcome__title">Hi, How can I assist you ?</h1>
            </motion.div>
          )}
        </AnimatePresence>

        {activeConversation && <ChatMessages conversation={activeConversation} />}

        <motion.div
          layout="position"
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="chat-composer-wrap"
          ref={composerWrapRef}
        >
          <ChatComposer onEngage={() => setEngaged(true)} />
        </motion.div>
      </main>
    </div>
  );
}

function ChatMessages({ conversation }) {
  return (
    <div className="chat-messages">
      {conversation.messages.map((msg, i) => (
        <div
          key={i}
          className={
            "chat-bubble " +
            (msg.role === "user" ? "chat-bubble--user" : "chat-bubble--assistant")
          }
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
