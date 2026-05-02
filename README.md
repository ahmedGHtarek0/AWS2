# 💊 MedScript – AI Prescription Reader

MedScript is a full-stack medical utility that leverages AI (OCR) to read prescription images, identify drugs, and check for potentially dangerous interactions. Built with a high-performance Redis-only backend and a stunning glassmorphism frontend.

## ✨ Features

- **🔐 Secure Auth**: Simple yet robust username/password authentication using Redis hashes and bcrypt.
- **🖼️ AI OCR**: Extract drug names from images using Tesseract.js.
- **⚠️ Interaction Guard**: Real-time checking of drug-drug interactions with cached results.
- **📜 Medical History**: Persistent history of prescriptions saved in Redis.
- **🎨 Modern UI**: Premium glassmorphism design with Framer Motion animations.
- **⚡ Redis-Only**: Extremely fast data access using Redis as the primary and only database.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express, Redis.
- **AI/ML**: Tesseract.js (OCR).
- **Security**: bcrypt (password hashing), UUID (session tokens).

## 📁 Project Structure

```text
/
├── client/          # Vite + React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application pages (Landing, Upload, etc.)
│   │   └── services/   # API communication (Axios)
│   └── index.css       # Glassmorphism design system
└── server/          # Node.js + Express Backend
    ├── config/      # Redis connection
    ├── controllers/ # Business logic
    ├── middleware/  # Auth & Security
    └── routes/      # API Endpoints
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Redis Cloud Account (Credentials already configured in `.env`)

### 2. Backend Setup
```bash
cd server
npm install
npm run start
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🧪 Redis Data Model

- **Users**: `user:{username}` (Hash)
- **Sessions**: `session:{token}` (String)
- **Prescriptions**: `prescription:{id}` (Hash)
- **History**: `user:{username}:prescriptions` (List)
- **OCR Cache**: `ocr:{image_hash}` (String)
- **Interactions**: `interaction:{drugA}:{drugB}` (String)

## 🔐 Security
- Passwords are never stored in plain text (bcrypt).
- Routes are protected via token-based middleware.
- Redis connection is secured via SSL and password.
