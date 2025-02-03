import React, { useState } from "react";
import { Menu, Send } from "lucide-react";
import { motion } from "framer-motion";

export function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        { text: inputMessage, isBot: false },
      ]);
      setInputMessage("");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "I'm here to help!", isBot: true },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#030f0f] text-white">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 w-64 h-full bg-black p-4 shadow-lg z-50"
      >
        <h2 className="text-xl font-bold mb-4">Chat Sessions</h2>
        <button
          className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
          onClick={() => setIsSidebarOpen(false)}
        >
          Close
        </button>
      </motion.div>

      {/* Main Chat Window */}
      <div className={`flex flex-col w-full h-screen transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}>
        <div className="bg-[#03624c] p-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white mr-4 hover:bg-[#030f0f] p-2 rounded"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-white text-xl font-bold">DostAi</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-4xl font-bold text-[#00df82]">DostAi</h1>
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
              >
                <span
                  className={`p-3 rounded-lg shadow-lg max-w-3/4 ${msg.isBot ? "bg-gray-700" : "bg-blue-500"}`}
                >
                  {msg.text}
                </span>
              </motion.div>
            ))
          )}
        </div>
        {/* Chat Input */}
        <div className="bg-[#03624c] p-4 fixed bottom-0 w-full max-w-3xl mx-auto left-0 right-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#00df82]"
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#00df82] text-[#030f0f] p-2 rounded-full hover:bg-[#00cf72]"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
