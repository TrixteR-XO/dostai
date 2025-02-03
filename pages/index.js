import { useState } from "react";
import { motion } from "framer-motion";

export default function Chatbot() {
  const [chatSessions, setChatSessions] = useState([]); // Stores multiple chats
  const [currentChat, setCurrentChat] = useState([]);
  const [input, setInput] = useState("");

  const startNewChat = () => {
    if (currentChat.length > 0) {
      setChatSessions([...chatSessions, currentChat]); // Save current chat to history
    }
    setCurrentChat([]); // Start fresh chat
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
      setCurrentChat([...newMessages, { role: "bot", content: data.reply }]);
    } catch (error) {
      setCurrentChat([...newMessages, { role: "bot", content: "Error connecting to AI. Try again." }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent new line
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Chat Sessions */}
      <motion.div 
        initial={{ x: -300 }} 
        animate={{ x: 0 }} 
        transition={{ type: "spring", stiffness: 100 }}
        className="w-64 bg-gray-800 text-white p-4 flex flex-col"
      >
        <h2 className="text-lg font-bold mb-4">Chat Sessions</h2>
        <button 
          onClick={startNewChat} 
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
          + New Chat
        </button>
        <ul className="space-y-2 flex-1 overflow-auto">
          {chatSessions.map((chat, index) => (
            <motion.li 
              key={index} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.3 }}
              className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
              onClick={() => setCurrentChat(chat)}
            >
              Chat {index + 1}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Chat Section */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1 overflow-auto p-4">
          {currentChat.map((msg, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.2 }}
              className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
            >
              <span className={
                msg.role === "user"
                  ? "bg-blue-500 text-white p-2 rounded-lg"
                  : "bg-gray-300 p-2 rounded-lg chromatic-aberration"
              }>
                {msg.content}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Fixed Input Box at the Bottom */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.3 }}
          className="p-4 bg-white flex items-center border-t border-gray-300 fixed bottom-0 w-full max-w-3xl mx-auto left-0 right-0"
        >
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded focus:outline-none"
          />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage} 
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
