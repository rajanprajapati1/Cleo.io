"use client";

import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

const messageSuggestions = [
  "How's the weather today ?",
  "Create a Hello World project",
  "Set a reminder for an upcoming task",
  "organize my task by priority",
  "Track my daily progress." ,
];

export default function Component() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isThinking, setIsThinking] = useState(false); 

  const handleSendMessage = async (message) => {
    if (message.trim() === '') return;

    const newUserMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user'
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsThinking(true); 

    try {
      const response = await fetch('/api/cleo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const newAIMessage = {
        id: messages.length + 2,
        text: data.content,
        sender: 'ai'
      };

      setMessages(prevMessages => [...prevMessages, newAIMessage]);
      setIsThinking(false); 
    } catch (error) {
      console.error('Error:', error);
      setIsThinking(false); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-blue-500 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Cleo.io</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start ${message.sender === 'user' ? 'justify-end' : ''}`}>
              {message.sender === 'ai' && (
                <div className="flex-shrink-0">
                  <Bot className="h-8 w-8 text-blue-500" />
                </div>
              )}
              <div className={`${message.sender === 'user' ? 'mr-3 bg-blue-500 text-white' : 'ml-3 bg-white text-gray-800'} rounded-lg p-3 shadow-sm`}>
                <p>{message.text}</p>
              </div>
              {message.sender === 'user' && (
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
              )}
            </div>
          ))}

          {/* Show "Thinking" message */}
          {isThinking && (
            <div className="flex items-start ml-8">
              <div className="ml-3 flex item-center justify-between bg-white text-gray-800 rounded-lg p-3 shadow-sm gap-3">
                   {Array.from({length:3}).map((val,i)=>{
                    return <div className="px-2 py-2 animate-bounce-up-down bg-gray-100 rounded-full "></div>
                   })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <div className="bg-white border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {showSuggestions && (
            <div className="flex flex-wrap gap-2 mb-4">
              {messageSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center">
            <label htmlFor="message-input" className="sr-only">Type your message</label>
            <input
              type="text"
              id="message-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 outline-none form-input block w-full  border-gray-300 focus:border-blue-500 pr-4 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="inline-flex items-center px-3 py-3 border border-transparent rounded-full shadow-sm justify-center text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Send className="" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
