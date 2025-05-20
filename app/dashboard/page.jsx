'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import FileUpload from '../../components/FileUpload';
import Chat from '../../components/Chat';
import PrivateRoute from '../../components/PrivateRoute';
import Sidebar from '../../components/Sidebar';
import { db, auth } from '../firebaseClient';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Dashboard() {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [chats, setChats] = useState([]);
    const [user, setUser] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [showUpload, setShowUpload] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility on mobile

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchChats(currentUser.uid);

                const chatIdFromUrl = searchParams.get('chatId');
                if (chatIdFromUrl) {
                    loadExistingChat(chatIdFromUrl, currentUser.uid);
                } else {
                    setShowUpload(true);
                }
            }
        });
        return () => unsubscribe();
    }, [searchParams]);

    const fetchChats = async (uid) => {
        const chatsCollection = collection(db, `users/${uid}/chats`);
        const chatSnapshot = await getDocs(chatsCollection);
        const chatList = chatSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setChats(chatList);
    };

    const loadExistingChat = async (chatId, uid) => {
        try {
            const chatDocRef = doc(db, `users/${uid}/chats`, chatId);
            const chatDoc = await getDoc(chatDocRef);

            if (chatDoc.exists()) {
                const chatData = chatDoc.data();
                setCurrentChat(chatData);
                setCurrentChatId(chatId);
                setUploadedFile(chatData.file);
                setShowUpload(false);
            } else {
                console.error("Chat not found");
                setShowUpload(true);
            }
        } catch (error) {
            console.error("Error loading chat:", error);
            setShowUpload(true);
        }
    };

    const handleNewChat = () => {
        setCurrentChatId(null);
        setCurrentChat(null);
        setUploadedFile(null);
        setShowUpload(true);
        setIsSidebarOpen(false); // Close sidebar on new chat
        router.push('/dashboard');
    };

    const handleStartChat = async () => {
        if (user && uploadedFile) {
            setLoading(true);
            const newChat = {
                createdAt: new Date().toISOString(),
                file: uploadedFile,
                messages: [],
                title: `Chat ${chats.length + 1}`,
            };

            try {
                const docRef = await addDoc(collection(db, `users/${user.uid}/chats`), newChat);
                const chatWithId = { id: docRef.id, ...newChat };

                setCurrentChatId(docRef.id);
                setCurrentChat(newChat);
                setChats([chatWithId, ...chats]);
                setShowUpload(false);
                setIsSidebarOpen(false); // Close sidebar on start chat

                router.push(`/dashboard?chatId=${docRef.id}`);
            } catch (error) {
                console.error("Error creating new chat:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const selectChat = (chatId) => {
        setIsSidebarOpen(false); // Close sidebar when selecting a chat
        router.push(`/dashboard?chatId=${chatId}`);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <PrivateRoute>
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <Sidebar
                    chats={chats}
                    onSelectChat={selectChat}
                    onNewChat={handleNewChat}
                    currentChatId={currentChatId}
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    <Header>
                        {/* Hamburger Menu for Mobile */}
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden p-2 text-gray-600 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </Header>

                    <div className="flex-1 overflow-y-auto p-4">
                        {showUpload ? (
                            <div className="max-w-xl mx-auto">
                                <FileUpload setFile={setUploadedFile} />
                                {uploadedFile && (
                                    <button
                                        onClick={handleStartChat}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mt-4 mx-auto block flex items-center justify-center"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <svg
                                                className="animate-spin h-5 w-5 mr-2 text-white"
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
                                                    d="M4 12a8 8 0 018-8v8H4z"
                                                />
                                            </svg>
                                        ) : (
                                            'Start New Chat'
                                        )}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <Chat file={uploadedFile} chatId={currentChatId} />
                        )}
                    </div>
                </main>
            </div>
        </PrivateRoute>
    );
}