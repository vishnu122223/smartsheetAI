
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import aiServices from '../../services/ai.service.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Spinner from '../common/Spinner.jsx';
import MarkdownRenderer from '../common/MarkdownRenderer.jsx';
import toast from 'react-hot-toast';

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrolltoBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await aiServices.getChatHistory(documentId);
        setHistory(response.data);
      } catch {
        toast.error('Failed to fetch chat history');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrolltoBottom();
  }, [history]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await aiServices.chat(documentId, message);

      const botMessage = {
        role: 'assistant',
        content: response.data.answer,
      };

      setHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      toast.error(error?.error || error?.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';

    return (
      <div key={index} className={`flex my-4 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && (
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
            <Sparkles size={16} />
          </div>
        )}

        <div
          className={`max-w-xl px-4 py-3 rounded-xl text-sm ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {isUser ? (
            msg.content
          ) : (
            <div className="prose prose-sm">
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>

        {isUser && (
          <div className="w-9 h-9 rounded-full bg-gray-300 text-black flex items-center justify-center ml-2 font-semibold">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] bg-white border rounded-xl items-center justify-center">
        <Spinner />
        <p className="text-gray-600 mt-3">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white border border-gray-300 rounded-xl">

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare size={40} className="text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              Start chatting
            </h3>
            <p className="text-gray-500">
              Ask anything about your document
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        <div ref={messagesEndRef} />

        {loading && (
          <p className="text-sm text-gray-500 mt-2">Typing...</p>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg
            bg-white text-gray-900 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;