🎬 AI Movie Insight Builder
A Premium Full-Stack AI Platform built for the Brew Full-Stack Developer Internship Assignment.

🔗 Live Demo:https://abhirajchandrawanshi-ai-movie-insig.vercel.app/

📖 Overview:-
AI Movie Insight Builder allows users to input an IMDb movie ID (e.g., tt0133093) and dynamically retrieve:
🎬 Movie Title & Poster
👥 Cast List
📅 Release Year & IMDb Rating
📝 Official Plot Summary
🤖 AI-Generated Audience Insight
📊 Sentiment Classification (Positive / Mixed / Negative)

The application aggregates real audience reviews from TMDB and uses Google Gemini to generate structured AI sentiment analysis.

🧩 Assignment Requirements Coverage:-
As per the problem statement 
SDE Intern - Assignment II, the app implements:

✔ IMDb ID input
✔ Fetch movie metadata (poster, cast, year, rating)
✔ Retrieve audience reviews
✔ Use AI to summarize insights
✔ Display results in a clean UI
✔ Responsive design
✔ Error handling & validation
✔ Live deployment

🏗️ Tech Stack:-
Frontend:-
Next.js (App Router)
React
TypeScript
Tailwind CSS

Backend:-
Next.js API Routes (Node.js runtime)

External APIs:-
OMDb API – Movie metadata
TMDB API – Audience reviews
GEMINI API (gemini-2.5-flash) – AI summarization & sentiment extraction

Deployment:-
Vercel (GitHub-integrated CI/CD)

⚙️ Architecture:-
Data Flow Pipeline
IMDb ID Input
      ↓
OMDb API (metadata)
      ↓
TMDB API (reviews)
      ↓
Gemini AI (summary + sentiment)
      ↓
Structured UI Output

🧠 AI Implementation:-
Uses gemini-2.5-flash
Strict JSON prompt engineering
Defensive parsing with fallback handling
Sentiment extracted as:
Positive
Mixed
Negative

Robust Handling Includes:
Model error detection
JSON validation
Safe parsing with regex extraction
Graceful fallback messaging

🚀 Local Setup:-

1️⃣ Clone Repository
git clone https://github.com/abhirajchandrawanshi/ai-movie-insight.git
cd ai-movie-insight

2️⃣ Install Dependencies
npm install

3️⃣ Create .env.local
TMDB_API_KEY=your_tmdb_key
OMDB_API_KEY=your_omdb_key
GEMINI_API_KEY=your_gemini_key

4️⃣ Run Development Server
npm run dev

Visit:
http://localhost:3000

🧪 Testing:-

Basic testing includes:
API error response validation
Invalid IMDb ID handling
AI JSON parsing validation
Fallback summary verification
Run:
npm test

🎨 UI/UX Features:-
Responsive layout (mobile + desktop)
Modern gradient theme
Glassmorphism effect
Animated result rendering
Loading states
Clear error messaging
Structured sentiment badge with color coding

🛡️ Edge Case Handling:-
Invalid IMDb IDs
Missing TMDB reviews
AI API 404 / model errors
Network timeout resilience
Malformed AI JSON response
Empty sentiment fallback

📌 Tech Stack Rationale:-
Why Next.js?

Unified frontend and backend framework
Built-in API routing
Seamless Vercel deployment
Production-grade performance

Why TypeScript?
Strong typing reduces runtime errors
Improves maintainability

Why Gemini?

Structured JSON output
Strong summarization capabilities
Efficient sentiment classification

📌 Assumptions:-

IMDb ID provided corresponds to a valid movie.
TMDB contains sufficient audience reviews.
Gemini returns structured JSON as instructed.

🤖 AI Usage Disclosure:-

AI tools were used to accelerate iteration and refine prompt design.
All architectural decisions, implementation logic, and debugging were independently understood and implemented.

📁 Project Structure:-

ai-movie-insight/
│
├── app/
│   ├── api/
│   │   └── analysis/
│   │       └── route.ts
│   └── components/
│       ├── MovieCard.tsx
│       ├── SearchBar.tsx
│       └── AIInsights.tsx
│
├── lib/
│   ├── tmdb.ts
│   └── openai.ts
│
├── hooks/
│   └── useMovieSearch.ts
│
├── utils/
│   ├── formatRating.ts
│   └── truncateText.ts
│
├── types/
│   ├── movie.ts
│   └── ai.ts
│
├── styles/
├── public/
│   └── images/
│
├── __tests__/
└── README.md

👨‍💻 Author:
Abhiraj Chandrawanshi
B.Tech Computer Science
Full-Stack Developer

GitHub:
https://github.com/abhirajchandrawanshi
