'use client'

import { useState } from 'react'
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

export default function ChatApp() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'chat' | 'code' | 'error' }>>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (apiType: 'chat' | 'code') => {
    if (inputValue.trim()) {
      setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
      setInputValue('');
      setIsLoading(true);
      try {
        const response = await fetchFromAPI(apiType, inputValue);
        setMessages(prev => [...prev, { text: response, sender: apiType }]);
      } catch (error) {
        console.error('Error fetching from API:', error);
        setMessages(prev => [...prev, { text: `Error: ${error instanceof Error ? error.message : 'Failed to fetch response'}`, sender: 'error' }]);
      } finally {
        setIsLoading(false);
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
      <ScrollArea className="flex-grow mb-4 border border-gray-700 rounded-md p-4">
        {messages.map((message, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            className={`mb-2 p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 ml-auto' :
              message.sender === 'error' ? 'bg-red-600' : 'bg-gray-700'
              } max-w-[80%] ${message.sender !== 'user' ? 'mr-auto' : ''}`}
          >
            {message.sender === 'code' ? (
              <pre className="whitespace-pre-wrap break-words"><code>{message.text}</code></pre>
            ) : (
              message.text
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
          className="flex-grow bg-gray-800 text-white border-gray-700"
          disabled={isLoading}
        />
        <Button
          onClick={() => sendMessage('chat')}
          variant="outline"
          className="bg-white text-gray-900 hover:bg-gray-200"
          disabled={isLoading}
        >
          Chat API
        </Button>
        <Button
          onClick={() => sendMessage('code')}
          variant="outline"
          className="bg-white text-gray-900 hover:bg-gray-200"
          disabled={isLoading}
        >
          Code API
        </Button>
      </div>
    </div>
  )
}