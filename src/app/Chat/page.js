"use client";

import { useRef, useState, useEffect } from "react";
import { Send, Bot, User ,Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Header from './components/Header';
import { Typewriter } from 'react-simple-typewriter';


const messageSuggestions = [
  "How's the weather today ?",
  "Create a Hello World project",
  "Set a reminder for an upcoming task",
  "organize my task by priority",
  "Track my daily progress.",
];

export default function Component() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I assist you today?", sender: "ai" },
  ]);
  const [Show,SetShow] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const lastMessageRef = useRef(null);


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then((copyText) => {
      console.log(text)
    });
  };

  const handleSendMessage = async (message) => {
    if (message.trim() === "") return;

    const newUserMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue("");
    setShowSuggestions(false);
    setIsThinking(true);

    try {
      const response = await fetch("/api/cleo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      const newAIMessage = {
        id: messages.length + 2,
        text: data.content,
        sender: "ai",
      };

      if (data.isCode) {
        newAIMessage.text = `\`\`\`js\n${data.content}\n\`\`\``;
      }

      setMessages((prevMessages) => [...prevMessages, newAIMessage]);
      setIsThinking(false);
    } catch (error) {
      console.error("Error:", error);
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

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
     <Header/>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start ${
                message.sender === "user" ? "justify-end" : ""
              }`}
            >
              {message.sender === "ai" && (
                <div className="flex-shrink-0">
                  <Bot className="h-8 w-8 text-blue-500" />
                </div>
              )}
              <div
                className={`${
                  message.sender === "user"
                    ? "mr-3 bg-blue-500 text-white"
                    : "ml-3 bg-white text-gray-800"
                } rounded-lg p-3 shadow-sm`}
              >
{Show && (message.sender !== "user" && messages.length > 1 && index !== 0) && <div className="Copy flex item-center py-3 justify-end w-full ">
                  <button onClick={()=>copyToClipboard(message.text)} className="flex item-center justify-center gap-2 text-gray-500 hover:text-gray-800 rounded-md  text-sm font-bold bg-gray-100 hover:font-bold px-2.5 py-1"><Copy className="h-4 w-4"/> Copy</button>
                </div>}
                {/* <ReactMarkdown>{message.text}</ReactMarkdown> */}
                                {message.sender === "ai" ? (
                  <Typewriter
                    words={[message.text]} // You can pass multiple strings
                    loop={1} // Will type once
                    cursor // Display typing cursor
                    typeSpeed={5} // Control typing speed
                    deleteSpeed={30}
                    delaySpeed={40}
                    onLoopDone={()=>SetShow(true)}
                  />
                ) : (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                )}

              </div>
              {message.sender === "user" && (
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
              )}
              {index === messages.length - 1 && (
                <div ref={lastMessageRef}></div>
              )}
            </div>
          ))}

          {/* Show "Thinking" message */}
          {isThinking && (
            <div className="flex items-start ml-8">
              <div className="ml-3 flex item-center justify-between bg-white text-gray-800 rounded-lg p-3 shadow-sm gap-3">
                {Array.from({ length: 3 }).map((val, i) => {
                  return (
                    <div className="px-2 py-2 animate-bounce-up-down bg-gray-100 rounded-full "></div>
                  );
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
            <label htmlFor="message-input" className="sr-only">
              Type your message
            </label>
            <input
              type="text"
              id="message-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 outline-none form-input text-black block w-full rounded-l-md border-gray-300 focus:border-blue-500 pr-4 focus:ring-blue-500"
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
  );
}
