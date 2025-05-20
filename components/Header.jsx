'use client';
import { signOut } from 'firebase/auth';
import { auth } from '../app/firebaseClient';
import { useRouter } from 'next/navigation';

export default function Header({ children }) { // Added children prop to render the hamburger menu
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-6">
      <div className="flex justify-between items-center">
        {/* Left Side: Hamburger Menu (for mobile) */}
        <div className="flex items-center">
          {children} {/* Render the hamburger menu button passed from Dashboard */}
          <div className="text-xl font-bold text-blue-600 ml-2">DocChat</div>
        </div>

        {/* Right Side: Sign Out Button */}
        <div>
          <button
            onClick={handleSignOut}
            className="text-gray-600 hover:text-gray-900 flex items-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}