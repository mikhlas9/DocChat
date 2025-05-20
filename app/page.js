export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-xl w-full">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">DocChat</span>
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Your secure and smart chatbot assistant. Please login or sign up to continue.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg text-lg font-medium hover:bg-blue-600 hover:text-white transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
