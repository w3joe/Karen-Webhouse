# Karen's WebHouse 🏠

_"Your website probably sucks" - Karen_

## 📖 Overview

**Karen's WebHouse** is an innovative web application that delivers brutally honest, hilariously sarcastic website critiques through an AI-powered conversational agent named Karen. Combining cutting-edge vision AI with natural voice interaction, Karen analyzes your website's design flaws and roasts them with personality—complete with visual annotations highlighting every problematic area.

## 💡 The Concept

Traditional website audits are boring, technical, and lack personality. Karen's WebHouse flips this on its head by providing:

- **Entertaining Design Critiques**: Karen delivers website analysis with sarcasm, wit, and zero filter
- **Visual Annotations**: Problematic design areas are automatically circled and highlighted on your website screenshot
- **Real-time Voice Interaction**: Chat with Karen using ElevenLabs' conversational AI technology before, during, and after the roast
- **Interruption Handling**: Try to interrupt Karen mid-roast—she'll roast you back for it
- **Comprehensive Reports**: Downloadable PDF reports with all design flaws, severity ratings, and actionable recommendations

### How It Works

1. **Submit Your URL**: Enter any website URL you want Karen to critique
2. **Wait for Analysis**: Karen makes snarky comments while capturing and analyzing the site
3. **Get Roasted**: Hear Karen narrate each design flaw while visual annotations highlight problem areas
4. **Download Report**: Get a comprehensive PDF report with all findings and recommendations

## 🚀 Tech Stack

### Frontend
- **Next.js 16** - React-based web framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Three.js** - 3D graphics and visualizations

### AI & Voice
- **Anthropic Claude Sonnet** - Vision AI for website analysis and design critique
- **ElevenLabs Conversational AI** - Real-time voice agent with Karen's personality
- **ElevenLabs React SDK** - Voice integration components

### Backend & Services
- **Convex** - Real-time backend and database
- **Puppeteer** - Headless browser for website screenshots
- **Next.js API Routes** - RESTful endpoints

### Document Generation
- **jsPDF** - PDF report generation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🎨 Key Features

- **AI-Powered Analysis**: Claude Sonnet vision model analyzes UI/UX, typography, color schemes, layout, and accessibility
- **Voice Personality**: ElevenLabs agent maintains Karen's sarcastic, brutally honest persona throughout
- **Dynamic Annotations**: Real-time highlighting of design flaws synced with Karen's narration
- **Severity Ratings**: Issues categorized as Low, Medium, High, or Critical
- **Interactive Reports**: Click annotations to replay Karen's comments about specific issues
- **Session Management**: Support for multiple roast sessions with conversation history
- **Responsive Design**: Works on desktop and mobile (optimized for desktop experience)

## 📋 Prerequisites

Before installation, ensure you have:

- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **API Keys** (see Environment Variables section)

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/w3joe/karens-webhouse.git
cd karens-webhouse
```

### 2. Install Dependencies

Choose your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```bash
# Required API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id_here

# Convex Backend (if using)
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here

# Optional Configuration
NODE_ENV=development
MAX_CONCURRENT_ROASTS=10
```

#### Getting API Keys

- **Anthropic Claude**: Sign up at [console.anthropic.com](https://console.anthropic.com/)
- **ElevenLabs**: Create an account at [elevenlabs.io](https://elevenlabs.io/) and set up a conversational AI agent
- **Convex**: Set up a project at [convex.dev](https://www.convex.dev/)

### 4. Run the Development Server

```bash
npm run dev
convex run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see Karen's WebHouse in action.

## 🎯 Usage

1. **Enter a Website URL**: Type any valid website URL into the input field
2. **Click "Roast My Website"**: Karen begins analyzing the site
3. **Interact with Karen**: Chat with the voice agent during and after analysis
4. **View Annotations**: See design flaws highlighted on the screenshot
5. **Download Report**: Get a comprehensive PDF with all findings

## 🎭 About Karen

Karen is an AI agent with personality. She's sarcastic, brutally honest, and hilariously mean while being technically accurate. When you interrupt her, she'll roast you for it. She's powered by ElevenLabs' conversational AI and provides legitimate design critiques wrapped in entertainment.

---

**Built with ❤️ and sarcasm**
