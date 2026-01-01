# 🎲 Label Highlighter

Built with a mobile-first approach, it features a responsive grid that automatically highlights recent entries with a visual glow effect, making it easy to spot active numbers at a glance.

---

### 🔗 Links
- **Live Demo:** [label-highlighter.vercel.app](https://label-highlighter.vercel.app/)
- **Repository:** [github.com/itzRaghav14/label-highlighter](https://github.com/itzRaghav14/label-highlighter)

---

## ✨ Key Features

- **Smart Tracking:** Quickly input numbers (0-36) and view them in a scrollable history queue.
- **Interactive Grid:** The 0-36 board illuminates the top 9 most recent numbers, providing real-time visual feedback.
- **Offline Capable (PWA):** Installable on your mobile home screen. The app works flawlessly without an internet connection.
- **Persistent Data:** Uses local storage to automatically save your history, ensuring you never lose your progress even if you close the browser.

## 🛠 Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS**
- **Framer Motion**
- **Serwist** (Service Worker)

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone git@github.com:itzRaghav14/label-highlighter.git
   cd label-highlighter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** To test the PWA capabilities (offline mode), run the build command (`npm run build`) and serve the output folder, as Service Workers are disabled in development mode to improve debugging speed.