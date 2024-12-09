import React, { useState } from 'react';

interface Message {
  sender: string;
  text: string;
  timestamp: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Handle sending message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        sender: 'User', // You can change this to the actual sender
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col w-80 h-full p-4 bg-gray-800 text-white rounded-md shadow-md">
      <div className="flex-1 overflow-y-auto">
        {/* Messages list */}
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-gray-400 text-sm">{message.timestamp}</span>
              <div>
                <div className="bg-gray-600 p-2 rounded-md text-sm">{message.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input for new message */}
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 p-2 rounded-md bg-gray-700 text-white outline-none"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
