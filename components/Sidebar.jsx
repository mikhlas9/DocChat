'use client';
import { useState } from 'react';
import { format } from 'date-fns';

export default function Sidebar({ chats, onSelectChat, onNewChat, currentChatId, isSidebarOpen, toggleSidebar }) {
    const [searchTerm, setSearchTerm] = useState('');

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'MMM d, yyyy');
        } catch (error) {
            return 'Unknown date';
        }
    };

    const getFirstMessage = (messages) => {
        if (!messages || messages.length === 0) {
            return 'No messages';
        }

        const firstUserMessage = messages.find((msg) => msg.role === 'user');
        if (firstUserMessage) {
            return firstUserMessage.text.length > 28
                ? firstUserMessage.text.substring(0, 28) + '...'
                : firstUserMessage.text;
        }

        return 'No messages';
    };

    const filteredChats = chats.filter((chat) => {
        const messagesText = chat.messages
            ? chat.messages.map((msg) => msg.text).join(' ').toLowerCase()
            : '';

        return (
            messagesText.includes(searchTerm.toLowerCase()) ||
            (chat.title && chat.title.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    return (
        <>
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col h-full border-r border-gray-700 transform transition-transform duration-300 z-50
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:static md:translate-x-0 md:w-64 md:flex`}
            >
                {/* New Chat Button */}
                <div className="p-4">
                    <button
                        onClick={onNewChat}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 px-4 rounded-lg flex items-center justify-center transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        New Chat
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 mb-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-800 text-white w-full py-2 px-4 pl-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 absolute top-2.5 left-2.5 text-gray-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.length === 0 ? (
                        <div className="text-gray-400 text-center p-4 text-sm">
                            {searchTerm ? 'No chats found' : 'No chat history'}
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => onSelectChat(chat.id)}
                                className={`p-3 hover:bg-gray-800 cursor-pointer border-l-4 ${
                                    currentChatId === chat.id
                                        ? 'border-blue-500 bg-gray-800'
                                        : 'border-transparent'
                                }`}
                            >
                                <div className="text-sm font-medium truncate">
                                    {chat.title || `Chat ${chat.id.substring(0, 6)}`}
                                </div>
                                <div className="text-xs text-gray-400 truncate mt-1">
                                    {getFirstMessage(chat.messages)}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {formatDate(chat.createdAt)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}