import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Chatbot() {
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chatSessions")) || [];
    setChatSessions(savedChats);
  }, []);

  const startNewChat = () => {
    if (currentChat.length > 0) {
      const updatedChats = [...chatSessions, currentChat];
      setChatSessions(updatedChats);
      localStorage.setItem("chatSessions", JSON.stringify(updatedChats));
    }
    setCurrentChat([]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...currentChat, { role: "user", content: input }];
    setCurrentChat(newMessages);
    setInput("");

    try {
      const response = await fetch("https://dostaibackend-production.up.railway.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setCurrentChat([...newMessages, { role: "bot", content: formatMessage(data.reply) }]);
    } catch (error) {
      setCurrentChat([...newMessages, { role: "bot", content: "Error connecting to AI. Try again." }]);
    }
  };

  const formatMessage = (message) => {
    return message
      .replace(/\n\n/g, "<br /><br />")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/(\d+\. )/g, "<br /><strong>$1</strong>");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar for Chat Sessions */}
      <motion.div 
        initial={{ x: -300 }} 
        animate={{ x: 0 }} 
        transition={{ type: "spring", stiffness: 100 }}
        className="w-80 bg-black text-white p-6 flex flex-col border-r border-gray-800 shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Chat Sessions</h2>
        <button 
          onClick={startNewChat} 
          className="mb-4 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg"
        >
          + New Chat
        </button>
        <ul className="space-y-3 flex-1 overflow-auto">
          {chatSessions.map((chat, index) => (
            <motion.li 
              key={index} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.3 }}
              className="p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition"
              onClick={() => setCurrentChat(chat)}
            >
              Chat {index + 1}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Chat Section */}
      <div className="flex flex-col flex-1 p-6 relative">
        <div className="flex-1 overflow-auto space-y-3 p-6 bg-gray-800 rounded-lg">
          {currentChat.map((msg, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.2 }}
              className={`mb-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <span className={
                msg.role === "user"
                  ? "bg-blue-500 text-white p-3 rounded-lg shadow-lg max-w-3/4"
                  : "bg-gray-700 text-white p-3 rounded-lg shadow-lg max-w-3/4"
              } dangerouslySetInnerHTML={{ __html: msg.content }}>
              </span>
            </motion.div>
          ))}
        </div>

        {/* Fixed Input Box */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.3 }}
          className="p-4 bg-gray-900 flex items-center border-t border-gray-700 fixed bottom-0 w-full max-w-3xl mx-auto left-0 right-0 rounded-lg shadow-lg"
        >
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 p-3 border bg-gray-800 rounded-lg text-white focus:outline-none"
          />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage} 
            className="ml-3 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            Send
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
