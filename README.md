# 🚀 AI Study Assistant

**Supercharge your learning with an AI-powered study dashboard that instantly turns your PDFs into interactive chats, summaries, and quizzes.**

The AI Study Assistant is a full-stack application designed to accelerate the learning process. By combining the power of modern Large Language Models (LLMs) with intuitive user interfaces, students and professionals can upload their learning materials and immediately engage with them. 

---

## ✨ Key Features

- 📄 **Smart PDF Processing:** Upload any study material or document. The system automatically extracts, chunks, and indexes the text using FAISS and HuggingFace embeddings for lightning-fast retrieval.
- 💬 **Interactive AI Chat:** Ask questions directly about your uploaded documents. The RAG (Retrieval-Augmented Generation) pipeline ensures the AI gives accurate answers based strictly on your notes.
- 📝 **Instant Summarization:** Don't have time to read a 50-page document? Generate a concise, high-level summary with a single click.
- 🎯 **Automated Quizzes:** Test your knowledge. The AI automatically generates multiple-choice quizzes based on the contents of your documents to solidify your learning.
- 📈 **Study Dashboard & History:** Track your progress, review past quizzes, and monitor your study intensity over the week with beautiful charts and subject mastery metrics.
- 🔐 **Secure Authentication:** Features secure JWT-based login, user registration, and Google OAuth integration to keep your study data private and persistent.

---

## 🛠️ Technology Stack

**Frontend:**
- [Next.js](https://nextjs.org/) (React Framework)
- Tailwind CSS (Styling)
- Lucide Icons & Framer Motion (Animations)

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) (High-performance Python web framework)
- MongoDB (Database for users, history, and chat logs)
- FAISS (Vector Database for document search)
- LangChain & Groq (LLM Orchestration and ultra-fast inference)
- Sentence-Transformers (Local embedding generation)

---

## 💻 Getting Started (Local Development)

You can run this project locally using either **Docker** (Recommended) or your native Node.js/Python environment.

### Prerequisites
- Obtain a free API key from [Groq Console](https://console.groq.com/) and place it in your `backend/.env` file.

### Option A: Running with Docker (Recommended)
The easiest way to run the app, including the database, is using Docker Compose.

1. Ensure **Docker Desktop** is installed and running.
2. Run the following command in the root folder:
```bash
docker-compose up -d --build
```
3. That's it! The application will be available at `http://localhost:3000`.

### Option B: Running without Docker
If you prefer running the services natively, you will need Node.js, Python, and a locally running instance of MongoDB.

1. **Install all dependencies:**
```bash
npm run install:all
```
2. **Start the development servers concurrently:**
```bash
npm run dev
```

---

## 🌍 Accessing the Application
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
