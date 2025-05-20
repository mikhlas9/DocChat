Chatbot App
Overview
Chatbot App ("DocChat") is a web application that allows users to upload documents (PDF, JPG, PNG) and chat with an AI to extract information from the uploaded documents. The app is built using Next.js for the frontend, Firebase for authentication and database storage, and integrates with the Google Generative AI API for natural language processing. The app features a responsive UI with a sidebar for chat history, a document upload interface, and a chat window for interacting with the AI.

Features

Document Upload: Users can upload PDF, JPG, or PNG files to interact with.
Chat Interface: Users can ask questions about the uploaded document, and the AI responds using the Google Generative AI API.
Chat History: A sidebar displays past chats, allowing users to switch between conversations.
Responsive Design: The UI is optimized for both mobile and desktop devices, with a toggleable sidebar on mobile.
Authentication: Firebase Authentication is used for user login and registration.

Setup Instructions
1. Clone the Repository
If you haven’t already set up a GitHub repository, follow the instructions in the "GitHub Repository Setup" section below. Otherwise, clone the repository:
git clone <repository-url>
cd CHATBOT-APP

2. Install Dependencies
Install the required dependencies using npm:
npm install

3. Configure Environment Variables
Create a .env.local file in the root directory and add the following environment variables:
NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY=<your-google-generative-ai-api-key>
NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-firebase-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-firebase-app-id>


Replace <your-...> with the actual values from your Firebase project and Google Cloud Console.
Ensure .env.local is added to .gitignore to avoid committing sensitive information.

4. Run the Development Server
Start the Next.js development server:
npm run dev

Open your browser and navigate to http://localhost:3000 to see the app in action.
5. Build for Production
To build the app for production:
npm run build

Then start the production server:
npm start


---

## 📸 Screenshots

### 💻 Desktop View

![Desktop View](./c296108f-52fc-43f9-a874-9d0c25fe988c.png)

### 📱 Mobile View

![Desktop View](./40d29e29-3951-49e5-8c3b-83062d9d52a9.png)

---
