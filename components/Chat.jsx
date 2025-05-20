'use client';
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db, auth } from '../app/firebaseClient';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export default function Chat({ file, chatId }) {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      if (chatId && auth.currentUser) {
        try {
          setIsLoading(true);
          const chatDoc = await getDoc(doc(db, `users/${auth.currentUser.uid}/chats`, chatId));
          if (chatDoc.exists()) {
            const chatData = chatDoc.data();
            setMessages(chatData.messages || []);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([{ role: 'error', text: 'Failed to load chat history.' }]);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchMessages();
  }, [chatId]);

  async function handleSendMessage() {
    if (input.trim().length && auth.currentUser && chatId) {
      let chatMessages = [...messages, { role: 'user', text: input }, { role: 'loader', text: '' }];
      setInput('');
      setMessages(chatMessages);
      setIsLoading(true);

      try {
        const result = await model.generateContent([
          {
            inlineData: {
              data: file.file,
              mimeType: file.type,
            },
          },
          `
            Answer this question about the attached document: ${input}.
            Answer as a chatbot with short messages and text only (no markdowns, tags or symbols)
            Chat history: ${JSON.stringify(messages)}
          `,
        ]);

        chatMessages = [
          ...chatMessages.filter((msg) => msg.role !== 'loader'),
          { role: 'model', text: result.response.text() },
        ];
        setMessages(chatMessages);

        // Save messages to Firestore
        await updateDoc(doc(db, `users/${auth.currentUser.uid}/chats`, chatId), {
          messages: chatMessages,
        });
      } catch (error) {
        chatMessages = [
          ...chatMessages.filter((msg) => msg.role !== 'loader'),
          { role: 'error', text: 'Error sending message, please try again later.' },
        ];
        setMessages(chatMessages);
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (!auth.currentUser) {
      setMessages([...messages, { role: 'error', text: 'User not authenticated.' }]);
    } else if (!chatId) {
      setMessages([...messages, { role: 'error', text: 'No active chat session.' }]);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="flex flex-col h-full bg-white shadow-md rounded-lg overflow-hidden">
      <div className="text-xl font-semibold p-4 border-b border-gray-200 text-gray-800">
        Chat with your document
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse text-gray-500">Loading chat history...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            Start a new conversation by sending a message below.
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : msg.role === 'model'
                    ? 'bg-gray-200 text-gray-900'
                    : msg.role === 'error'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {msg.role === 'loader' ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <textarea
className="text-gray-600 flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[50px] max-h-[150px] resize-none text-sm md:text-base placeholder:text-sm md:placeholder:text-base"
placeholder="Ask any question about the uploaded document..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim().length}
            className={`px-4 py-2 rounded-lg transition ${
              isLoading || !input.trim().length
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}