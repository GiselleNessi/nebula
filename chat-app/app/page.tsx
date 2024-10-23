'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image';
import logo from '../public/logo-white.png'


export default function ChatApp() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'api1' | 'api2' }>>([])
  const [inputValue, setInputValue] = useState('')

  const sendMessage = (apiType: 'api1' | 'api2') => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }])
      // Simulate API call
      setTimeout(() => {
        setMessages(prev => [...prev, { text: `Response from ${apiType}`, sender: apiType }])
      }, 1000)
      setInputValue('')
    }
  }

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
        <h1 className="text-3xl mt-10 font-bold mt-2 text-white">Project Nebula</h1>
      </div>
      <ScrollArea className="flex-grow mb-4 border border-gray-700 rounded-md p-4">
        {messages.map((message, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            className={`mb-2 p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
              } max-w-[80%] ${message.sender !== 'user' ? 'mr-auto' : ''}`}
          >
            {message.text}
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
        />
        <Button onClick={() => sendMessage('api1')} variant="outline" className="bg-white text-gray-900 hover:bg-gray-200">
          API 1
        </Button>
        <Button onClick={() => sendMessage('api2')} variant="outline" className="bg-white text-gray-900 hover:bg-gray-200">
          API 2
        </Button>
      </div>
    </div>
  )
}