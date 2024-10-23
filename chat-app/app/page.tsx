'use client'

import { Key, useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import logo from "../public/logo-white.png"

const fetchFromAPI = async (apiType: 'chat' | 'code', message: string) => {
  try {
    const response = await fetch(`/api/proxy?type=${apiType}&message=${encodeURIComponent(message)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const formatChatMessage = (text: string) => {
  // Split the text by code blocks (```) and format accordingly
  const parts = text.split(/```/g);
  return parts.map((part, index) => {
    if (index % 2 === 0) {
      // Regular text (outside of code blocks)
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <p key={index} className="mb-2 text-lg leading-relaxed break-words">
          {part.trim()}
        </p>
      );
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      // Code block (inside of ```)
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <pre key={index} className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono mb-4 whitespace-pre-wrap break-words">
          <code>{part.trim()}</code>
        </pre>
      );
    }
  });
};

export default function ChatApp() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'chat' | 'code' | 'error' }>>([])
  const [inputValue, setInputValue] = useState('')
  const [loadingButton, setLoadingButton] = useState<null | 'chat' | 'code'>(null);

  const sendMessage = async (apiType: 'chat' | 'code') => {
    if (inputValue.trim()) {
      setMessages((prev) => [...prev, { text: inputValue, sender: 'user' }]);
      setInputValue('');
      setLoadingButton(apiType); // Set the loading button state
      try {
        const response = await fetchFromAPI(apiType, inputValue);
        setMessages((prev) => [...prev, { text: response, sender: apiType }]);
      } catch (error) {
        console.error('Error fetching from API:', error);
        setMessages((prev) => [...prev, { text: `Error: ${error instanceof Error ? error.message : 'Failed to fetch response'}`, sender: 'error' }]);
      } finally {
        setLoadingButton(null); // Reset the loading button state
      }
    }
  };

  return (
    <div className="flex flex-col h-screen text-white p-4">
      <div className="flex flex-col items-center mb-4">
        <Image
          src={logo}
          alt="Chat App Logo"
          width={200}
          height={60}
          className="h-15 w-auto"
        />
        <h1 className="text-2xl font-bold mt-10 text-white">Project Nebula</h1>
      </div>
      <ScrollArea className="flex-grow mb-4 rounded-lg border border-gray-700 p-4">
        {messages.map((message, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            className={`mb-2 p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 ml-auto' :
              message.sender === 'error' ? 'bg-red-600' : 'bg-gray-700'
              } max-w-[80%] ${message.sender !== 'user' ? 'mr-auto' : ''}`}
          >
            {message.sender === 'chat' || message.sender === 'code' ? (
              <div>{formatChatMessage(message.text)}</div> // Use the function here to format both chat and code messages
            ) : (
              <span>{message.text}</span>
            )}
          </div>
        ))}
      </ScrollArea>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow"
          disabled={loadingButton !== null}
        />
        <Button
          onClick={() => sendMessage('chat')}
          variant="outline"
          disabled={loadingButton === 'chat'} // Disable only the "Chat" button when it's loading
        >
          {loadingButton === 'chat' ? (
            // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            'Chat'
          )}
        </Button>

        <Button
          onClick={() => sendMessage('code')}
          variant="outline"
          disabled={loadingButton === 'code'} // Disable only the "Code" button when it's loading
        >
          {loadingButton === 'code' ? (
            // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            'Code'
          )}
        </Button>
      </div>
    </div>
  )
}