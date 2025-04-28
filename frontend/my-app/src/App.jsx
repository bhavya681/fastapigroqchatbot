import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatContainerRef = useRef(null);

  // Sample welcome message
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([{
        sender: 'ai', 
        text: "Hello! I'm your AI assistant. How can I help you today? 😊",
      }]);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!conversationId) {
      setConversationId(Date.now().toString());
    }
  }, [conversationId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === '') return;

    setLoading(true);
    const userMessage = { sender: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:8000/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) throw new Error('Error with API request');
      const data = await response.json();
      
      setChatHistory(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory(prev => [...prev, { 
        sender: 'ai', 
        text: "Sorry, I encountered an error. Please try again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex items-center">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white bg-opacity-30"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white bg-opacity-20"></div>
            <div className="relative w-12 h-12 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h1 className="text-xl font-bold text-white">AI Assistant</h1>
            <p className="text-xs text-purple-100">Always here to help</p>
          </div>
          <div className="ml-auto flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
          </div>
        </div>

        {/* Chat area */}
        <div 
          ref={chatContainerRef}
          className="h-96 overflow-y-auto p-6 bg-gradient-to-b from-gray-800 to-gray-900"
        >
          {/* Decorative elements */}
          <div className="absolute top-28 left-4 w-16 h-16 rounded-full bg-purple-600 opacity-10 blur-lg"></div>
          <div className="absolute bottom-40 right-8 w-24 h-24 rounded-full bg-blue-600 opacity-10 blur-lg"></div>

          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`max-w-xs sm:max-w-md relative ${msg.sender === 'user' ? '' : 'flex items-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl ${msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none' 
                    : 'bg-gray-700 text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm sm:text-base">{msg.text}</p>
                </div>
                {msg.sender === 'user' && (
                  <div className="absolute -bottom-1 right-0 w-3 h-3 overflow-hidden">
                    <div className="w-4 h-4 bg-blue-600 transform rotate-45 origin-bottom-left"></div>
                  </div>
                )}
                {msg.sender === 'ai' && (
                  <div className="absolute -bottom-1 left-0 w-3 h-3 overflow-hidden">
                    <div className="w-4 h-4 bg-gray-700 transform rotate-45 origin-bottom-right"></div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="mr-3 mt-1 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="bg-gray-700 text-gray-100 p-4 rounded-2xl rounded-bl-none max-w-xs sm:max-w-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
              <div className="absolute -bottom-1 left-0 w-3 h-3 overflow-hidden">
                <div className="w-4 h-4 bg-gray-700 transform rotate-45 origin-bottom-right"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <form onSubmit={sendMessage} className="flex items-center space-x-2">
            <div className="flex-grow relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-full py-3 px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                placeholder="Type your message..."
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <button type="button" className="text-gray-400 hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button type="button" className="text-gray-400 hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            AI assistant may produce inaccurate information about people, places, or facts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;