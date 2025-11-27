# Data Tech Hub 🇬🇭

A modern, referral-ready data vending platform built for Ghana.

## Tech Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **AI**: Google Gemini (Support Chat)

## 🚀 How to Deploy to Vercel

1.  **Clone/Download this repository**
2.  **Push to GitHub**
    - Create a new repository on GitHub.
    - Run:
      ```bash
      git init
      git add .
      git commit -m "Initial commit"
      git branch -M main
      git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
      git push -u origin main
      ```
3.  **Import to Vercel**
    - Go to [vercel.com/new](https://vercel.com/new).
    - Select your GitHub repository.
    - Vercel will automatically detect **Vite**.
4.  **Configure Environment Variables**
    - In the "Environment Variables" section of the Vercel deployment screen:
    - Add `API_KEY` with your Google Gemini API Key.
5.  **Deploy**
    - Click **Deploy**.
    - Your app will be live in less than a minute!

## 🛠 Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create `.env` file:
    ```bash
    cp .env.example .env
    # Add your API_KEY in the file
    ```
3.  Start server:
    ```bash
    npm run dev
    ```
