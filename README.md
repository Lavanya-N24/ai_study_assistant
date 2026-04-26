# 🚀 AI Study Assistant

Supercharge your learning with an AI-powered study dashboard that transforms PDFs into interactive chats, summaries, and quizzes.

---

## 📌 Overview

The **AI Study Assistant** is a full-stack application designed to make studying faster and smarter. It allows users to upload documents and interact with them using AI-powered features like chat, summarization, and quiz generation.

This project uses **Retrieval-Augmented Generation (RAG)** to ensure accurate responses based strictly on user-provided content.

---

## ✨ Features

- 📄 **Smart PDF Processing**
  Upload documents and automatically extract, chunk, and index text using FAISS and embeddings.

- 💬 **Interactive AI Chat**
  Ask questions about your documents and get precise answers.

- 📝 **Instant Summarization**
  Generate concise summaries of large documents instantly.

- 🎯 **Automated Quizzes**
  Create multiple-choice quizzes from your study material.

- 📈 **Study Dashboard**
  Track progress, history, and performance with visual insights.

- 🔐 **Secure Authentication**
  JWT-based authentication with optional Google OAuth login.

---

## 🛠️ Tech Stack

### Frontend

- Next.js (React Framework)
- Tailwind CSS
- Framer Motion
- Lucide Icons

### Backend

- FastAPI (Python)
- MongoDB
- FAISS (Vector Database)
- LangChain & Groq (LLM orchestration)
- Sentence-Transformers (Embeddings)

---

## 📁 Project Structure

````
ai-study-assistant/
│
├── frontend/        # Next.js frontend
├── backend/         # FastAPI backend
├── docker-compose.yml
└── README.md
---

## 💻 Getting Started

### Prerequisites

* Node.js
* Python
* MongoDB (local or Atlas)
* Groq API Key

---

## 🐳 Option A: Run with Docker (Recommended)

```bash
docker-compose up -d --build
````

👉 Application will run at:
Frontend: http://localhost:3000
Backend: http://localhost:8000

---

## ⚙️ Option B: Run without Docker

### Install dependencies

```bash
npm run install:all
```

### Start development servers

```bash
npm run dev
```

---

## 🌐 Access the Application

- Frontend Dashboard: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs

---

## 📡 API Endpoints (Sample)

- `POST /upload` → Upload PDF
- `POST /chat` → Ask questions
- `POST /quiz` → Generate quiz
- `GET /history` → Fetch user activity

---

## 💡 Motivation

Traditional studying is time-consuming and often inefficient. This project aims to improve learning efficiency by allowing users to interact directly with their study materials using AI.

---

## 🚀 Future Improvements

- Voice-based interaction
- Mobile application
- Advanced analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.

---

## 🙌 Acknowledgements

- HuggingFace
- LangChain
- Groq
- Open-source community
