import React, { useState, useEffect, useRef } from 'react';
import socketService from '../services/socket';
import '../styles/Chat.css';

interface Message {
  id?: string;
  userId: number;
  username: string;
  content: string;
  timestamp: Date;
}

interface ChatProps {
  currentUser: any;
  currentChannelId: string;
  socketConnected: boolean;
}

const Chat: React.FC<ChatProps> = ({ currentUser, currentChannelId, socketConnected }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socketConnected) return;

    // Join channel
    socketService.joinChannel(currentChannelId);

    // Listen for new messages
    socketService.onMessageReceived((message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup
    return () => {
      socketService.leaveChannel(currentChannelId);
    };
  }, [currentChannelId, socketConnected]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    setLoading(true);

    // Send message via Socket.io
    socketService.sendMessage(
      currentChannelId,
      inputValue,
      currentUser.id,
      currentUser.username
    );

    setInputValue('');
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="message">
              <strong>{message.username}</strong>
              <p>{message.content}</p>
              <span className="timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
