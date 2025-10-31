<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments//0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Vedic Sage: An Interactive Rigveda Storyteller

An immersive application that brings the ancient hymns of the Rigveda to life through AI-powered storytelling, visual animations, and synthesized audio, all guided by the persona of a wise Vedic Sage.

## Access the Application

**Live Demo:** [https://rg-veda-challenge-iip.vercel.app/](https://rg-veda-challenge-iip.vercel.app/)

**AI Studio (No API Key Required):** [https://ai.studio/apps/drive/1-AgqrFbotewUaOnWsrM3T8JB91OFbUZ9](https://ai.studio/apps/drive/1-AgqrFbotewUaOnWsrM3T8JB91OFbUZ9)  
Access the full experience without needing a paid Gemini API key to demo the TTS feature properly.

## Technical Features

- **AI-Powered Storytelling**: Leverages Google Gemini API to generate context-aware stories from Rigvedic hymns
- **Multi-language Support**: Stories available in multiple languages with real-time translation
- **Dynamic Visual Animations**: Interactive P5.js animations generated to complement each story
- **Text-to-Speech Integration**: Synthesized audio narration for an immersive experience
- **Vector Search**: Supabase-powered context-aware chat responses for enhanced interaction
- **Responsive Design**: Modern React-based UI with TypeScript for type safety
- **Caching System**: Efficient story and animation caching for improved performance

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- A Gemini API key (optional for local development, required for TTS features)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vinit-source/RgVeda-Challenge-IIP.git
   cd RgVeda-Challenge-IIP
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Set your `GEMINI_API_KEY` in `.env.local`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Disclaimer

Images are taken from various sources in the demo application. All sources should be considered acknowledged.
