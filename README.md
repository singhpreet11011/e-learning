# E-Learning Platform with Multi-Language Support

A comprehensive e-learning platform built with Next.js 14, featuring automatic translation to 20+ languages, video lessons, interactive quizzes, and progress tracking.

## Features

- 🌍 **Multi-Language Support**: Automatic translation to 20+ languages including Swedish, Arabic, Spanish, French, German, etc.
- 🎥 **Video Lessons**: YouTube video integration for educational content
- 📚 **Course Management**: Admin panel for creating courses, chapters, and lessons
- ✅ **Interactive Quizzes**: Multiple choice questions with images and videos
- 📊 **Progress Tracking**: Track lesson completion and quiz scores
- 🔐 **Google Authentication**: Secure sign-in with Google OAuth
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🔍 **SEO Optimized**: Built with Next.js 14 for excellent SEO performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS with Radix UI components
- **Translation**: Google Translate API
- **State Management**: Zustand & React Context
- **Type Safety**: TypeScript
- **Deployment Ready**: Optimized for Vercel

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Google OAuth credentials
- Google Translate API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd elearning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

   Then fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/elearning_db?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Google Translate API
   GOOGLE_TRANSLATE_API_KEY="your-google-translate-api-key"
   ```

4. **Set up the database**
   ```bash
   # Push the Prisma schema to your database
   npx prisma db push
  
   # Generate Prisma client
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret to your `.env` file

## Setting Up Google Translate API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Cloud Translation API
3. Go to "Credentials" → "Create Credentials" → "API Key"
4. Restrict the API key to Cloud Translation API
5. Copy the API key to your `.env` file

## Making a User Admin

To give admin privileges to a user:

1. First, sign in with Google to create a user account
2. Access your PostgreSQL database
3. Run the following SQL command:
   ```sql
   UPDATE "User" SET "isAdmin" = true WHERE email = 'your-email@gmail.com';
   ```

Or use Prisma Studio:
```bash
npx prisma studio
```
Then manually update the `isAdmin` field for your user.

## Project Structure

```
elearning-platform/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # UI components (Radix UI)
│   ├── layout/           # Layout components
│   ├── courses/          # Course-related components
│   └── home/             # Homepage components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static files
└── types/                # TypeScript type definitions
```

## Admin Features

As an admin, you can:
- Create new courses with title, description, and thumbnail
- Add chapters to courses
- Add lessons to chapters or directly to courses
- Add text content, images, and YouTube videos to lessons
- Create multiple-choice quizzes with images/videos
- Publish/unpublish courses and lessons
- View enrollment statistics

## User Features

Users can:
- Sign in with Google
- Browse available courses
- Enroll in courses
- Watch video lessons
- Read lesson content in their preferred language(s)
- Take quizzes
- Track their progress
- Switch between languages anytime

## Language Support

The platform supports automatic translation to:
- Arabic, Chinese, Danish, Dutch, English, Finnish
- French, German, Hindi, Italian, Japanese, Korean
- Norwegian, Polish, Portuguese, Russian, Spanish
- Swedish, Thai, Turkish

Users can select:
- **Primary Language**: Main translation language
- **Secondary Language**: Additional translation (shown below primary)
- Or use English only (no translation)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

The app is built with Next.js and can be deployed to any platform that supports Node.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify
- Netlify

## Database Options

### Production Database Options:
- **Supabase** (Recommended - Free tier available)
- **PlanetScale** (MySQL-compatible)
- **Neon** (PostgreSQL)
- **Railway PostgreSQL**
- **Amazon RDS**

## Troubleshooting

### Common Issues:

1. **Database connection errors**
   - Verify DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Check firewall/network settings

2. **Google OAuth not working**
   - Verify redirect URIs match exactly
   - Ensure NEXTAUTH_URL matches your domain
   - Check Google Cloud Console for any warnings

3. **Translation not working**
   - Verify Google Translate API is enabled
   - Check API key restrictions
   - Monitor API quota usage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.

---

**Note**: Remember to keep your API keys and secrets secure. Never commit them to version control.
