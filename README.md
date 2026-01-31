# 🌾 AAPLA 7/12 - Smart Farming Assistant
> *Empowering farmers with AI-driven insights, real-time market data, and voice-first accessibility.*

AAPLA 7/12 is a comprehensive **Progressive Web App (PWA)** designed to revolutionize how farmers interact with agricultural data. It combines traditional records (7/12) with modern AI technology to provide actionable advice in local languages.

![App Screenshot](https://raw.githubusercontent.com/placeholder-image.png)

## ✨ Key Features

### 🤖 Kisan AI Voice Assistant
- **Voice-First Interface**: Speak in your native language (Hindi, Marathi, English, Tamil + 8 others).
- **Smart Switch**: Automatically switches between **Online AI** (GPT-3.5) and **Offline Knowledge Base** based on internet connectivity.
- **Offline Capable**: Get answers about major crops (Wheat, Rice, Cotton, etc.) even without internet.

### 📱 Modern Dashboard
- **Feature Grid**: Quick access to Crop Advisory, Soil Reports, Disease Detection, and Market Prices.
- **Multilingual UI**: Fully localized interface for broader accessibility.
- **PWA Support**: Installable on mobile devices (Android/iOS) for a native app-like experience.

### 🔐 Secure Authentication
- **Powered by Firebase Auth**: Secure Login & Registration.
- **Social Login**: One-click **Google Login** integration.
- **Protected Routes**: Ensures sensitive data is accessible only to authenticated farmers.

### 🌍 Real-time Insights
- **Live Weather**: Location-based weather updates.
- **Market Trends**: Latest Mandi prices and graphical trends.
- **News**: Agricultural news ticker and updates.

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite
- **UI Framework**: Tailwind CSS, Shadcn UI, Lucid React Icons
- **PWA**: `vite-plugin-pwa` for service workers and manifest.
- **Backend/Auth**: Firebase (Authentication, Firestore, Analytics)
- **AI Integration**: OpenAI/AIML API + Web Speech API (Browser native)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Firebase Project Credentials

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/aapla-712-farm-insights.git
    cd aapla-712-farm-insights
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your keys:
    ```env
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_AIML_API_KEY=your_ai_api_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 📱 PWA Features
This app is fully PWA compliant. Use the "Add to Home Screen" option in your browser to install it as a standalone app. 
- **Offline Caching**: Core assets and offline data chunks are cached.
- **Manifest**: Custom icons and splash screens.

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.

---
*Built with ❤️ for Indian Farmers.*
