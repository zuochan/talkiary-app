# 📝 Talkiary

**Talkiary** is an AI-powered personal diary and daily planning tool.  
Through natural conversations with an AI assistant, users can:

- Reflect on their thoughts
- Create and refine a daily schedule
- Save and review their plans

Built on top of the excellent [Chatbot UI](https://github.com/mckaywrigley/chatbot-ui), this project expands it into a highly personalized, markdown-capable daily assistant.

---

## ✨ Features

- 💬 **Chat-based diary interface**
  - Talk with your AI like a journaling partner
  - Capture your mood, thoughts, and ideas naturally

- 🗓️ **Smart Schedule Generator**
  - The AI proposes a schedule based on your day
  - Output is in Markdown table format

- 💾 **Save Schedules to Supabase**
  - Store and retrieve your plans by date
  - Manual save button gives you full control

- 📋 **Markdown Rendering**
  - Tables, headings, and lists are beautifully rendered in the chat

- 🔒 **User Authentication**
  - Secure login powered by Supabase

---

## 🚀 Getting Started

### 1. Clone this repo

```bash
git clone https://github.com/zuochan/talkiary-app.git
cd talkiary-app
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. Start development

```bash
npm run dev
```

---

## 🧱 Built With

* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Supabase](https://supabase.com/)
* [OpenAI API](https://platform.openai.com/)
* [Chatbot UI (MIT Licensed)](https://github.com/mckaywrigley/chatbot-ui)

---

## 📄 License

This project is MIT-licensed and includes contributions from the original [Chatbot UI](https://github.com/mckaywrigley/chatbot-ui) project by [@mckaywrigley](https://github.com/mckaywrigley).


