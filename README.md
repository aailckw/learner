# Gemini Chat - AI Chatbot with Google Gemini

A minimal, elegant chatbot application built with Next.js 15, AI SDK 5, and Google Gemini. Features a clean, Apple-inspired design with full authentication, conversation management, and multimodal support.

## Features

- 🤖 **Google Gemini Integration** - Powered by Gemini 2.5 Flash
- 🔐 **Secure Authentication** - User accounts with NextAuth
- 💬 **Real-time Streaming** - Smooth, responsive chat experience
- 🖼️ **Multimodal Support** - Upload and analyze images
- 📝 **Conversation Management** - Save and organize chat history
- 🌓 **Dark/Light Mode** - Automatic theme switching
- 💾 **Persistent Storage** - PostgreSQL with Neon
- 🎨 **Minimal UI** - Clean, Apple-like design with shadcn/ui

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **AI SDK:** Vercel AI SDK 5
- **LLM:** Google Gemini (2.5 Flash/Pro)
- **Database:** Neon (PostgreSQL)
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **UI:** shadcn/ui + Tailwind CSS
- **Language:** TypeScript

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon account (for database)
- Google AI Studio account (for Gemini API key)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd learner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Update the `.env` file with your credentials:

```env
# Neon Database (already configured)
DATABASE_URL="your-neon-pooled-connection-url"
DIRECT_URL="your-neon-direct-connection-url"

# Google Gemini API Key (REQUIRED)
GOOGLE_GENERATIVE_AI_API_KEY="your-google-api-key"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Get Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy and paste it into `.env` as `GOOGLE_GENERATIVE_AI_API_KEY`

### 5. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in `.env`

### 6. Run database migrations

```bash
npx prisma generate
npx prisma migrate dev
```

### 7. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app!

## Usage

1. **Sign Up:** Create a new account on the signup page
2. **Sign In:** Login with your credentials
3. **Start Chatting:** Click "New Chat" to begin a conversation
4. **Upload Images:** Click the paperclip icon to upload images for analysis
5. **Manage Conversations:** View and switch between conversations in the sidebar
6. **Toggle Theme:** Click the sun/moon icon to switch themes

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── chat/         # Chat streaming endpoint
│   │   └── conversations/ # Conversation management
│   ├── auth/             # Auth pages (signin/signup)
│   └── page.tsx          # Main chat page
├── components/            # React components
│   ├── chat/             # Chat UI components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
└── middleware.ts          # Auth middleware
```

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/chat` - Stream chat responses
- `GET /api/conversations` - List user conversations
- `GET /api/conversations/[id]` - Get conversation details

## Database Schema

```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String?
  passwordHash  String
  conversations Conversation[]
  messages      Message[]
}

model Conversation {
  id       String    @id @default(cuid())
  title    String?
  userId   String
  user     User      @relation(...)
  messages Message[]
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(...)
  userId         String?
  user           User?        @relation(...)
  role           String       // 'user' or 'assistant'
  content        String
  imageUrl       String?
}
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format

# Prisma commands
npx prisma studio     # Open Prisma Studio
npx prisma generate   # Generate Prisma Client
npx prisma migrate dev # Run migrations
```

## Troubleshooting

### "Google Gemini API key is not configured"
- Make sure you've added `GOOGLE_GENERATIVE_AI_API_KEY` to your `.env` file
- Restart the development server after adding the key

### Database connection errors
- Verify your Neon connection strings are correct
- Check if your Neon project is active
- Ensure you're using the pooled connection URL for `DATABASE_URL`

### Authentication not working
- Generate and set a `NEXTAUTH_SECRET` in `.env`
- Clear browser cookies and try again
- Check the browser console for errors

## Future Enhancements

See [step2_enhance.md](./step2_enhance.md) for a detailed roadmap of planned features including:
- Voice input/output
- Model selection (Gemini Pro support)
- Advanced conversation management
- Collaboration features
- And much more!

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.