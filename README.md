# AlgoTeach

A "Quizlet for algorithm understanding" that acts as a study tool that trains you to instantly recognize which algorithmic pattern applies to a LeetCode style problem. There is also a coding feature where AI can grade your coding based off of a problem.

**Live demo:** [algoteach-1.onrender.com](https://algoteach-1.onrender.com)

---

## What it does

When you study for technical interviews, the hardest skill I have had trouble with isn't writing code, it's looking at a new problem and instantly recognizing what algorithm I have to use for that problem. AlgoTeach is a Quizlet style trainer for that pattern recognition.

You're shown a problem prompt and four pattern choices. You guess which pattern applies before seeing the solution. The app tracks which patterns you struggle with and shows you those problems first the next time you log in using a personalized recommendation feature. There is also a code practice view in which you can practice writing out code, and then check your code with AI. 

### Features that this application has

- **112 problems pulled from NeetCode 150** drawn from the NeetCode 150, tagged with the correct algorithmic pattern, key recognition clues, and time complexity.
- **Multiple-choice quiz mode** with instant feedback, explanations, and color-coded answers.
- **AI-powered "explain deeper" button** that calls GPT-4o-mini to generate a more detailed pattern explanation on demand.
- **Practice mode with a real code editor** (Monaco, the editor that powers VS Code). Write Python implementations of patterns and AI evaluates whether your code correctly implements the pattern and points out bugs.
- **Personalized problem ordering.** A backend priority-queue algorithm orders problems by your individual pattern success rate, so the weakest patterns show up first.
- **Live stats sidebar** showing total accuracy and your three weakest patterns, computed in real time with a MongoDB aggregation pipeline.
- **Response caching** for OpenAI calls it will repeat requests for the same problem's deeper explanation, which are served from MongoDB in ~30ms instead of ~3 seconds.

---

## Tech stack

- **Frontend:** React (Vite), Tailwind CSS, Monaco Editor
- **Backend:** Python with FastAPI, Pydantic for validation, Uvicorn as the server
- **Database:** MongoDB Atlas with three collections (`problems`, `attempts`, `cached_explanations`)
- **External API:** OpenAI (GPT-4o-mini) for both deeper explanations and code evaluation, called on the backend using OpenAI Platform API
- **Hosting:** Render (Web Service for the backend, Static Site for the frontend)

---

## Running it locally

You'll need Node 20+, Python 3.9+, a MongoDB Atlas account, and an OpenAI API key.

```bash
# Clone
git clone https://github.com/ecmchugh/AlgoTeach
cd AlgoTeach

# Backend
cd backend
python3 -m venv venv
./venv/bin/pip install -r requirements.txt

# Add your secrets
cp .env.example .env
# then edit backend/.env and set MONGODB_URI and OPENAI_API_KEY

# Seed problems into MongoDB (one-time)
./venv/bin/python seed.py

# Start the API
./venv/bin/python server.py
# → http://127.0.0.1:4000

# Frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env  # default points at localhost:4000
npm run dev
# → http://localhost:5173
```

---

## Learning Journey

### What inspired it

I'm currently learning data structures and algorithms, and the place where I have struggle is pattern recognition. You can read about sliding window for an hour, but until you've seen ten problems where it applies, you won't spot it on the eleventh. Existing tools like LeetCode push you toward solving full problems, but what I actually wanted was something fast like Quizlet. See a problem, guess the pattern, learn what gave it away, and move on to the next one.

### Potential impact

For students in DSA courses or anyone prepping for technical interviews (like me), this application could definitely help them. A trainer that cements "which pattern is this?" and brings your weak spots to light could help the user immediately recognize problems when they read the problem. The AI-driven code feedback in practice mode also helps you further understand why a certain algorithm would be used for a problem.

### New technology I learned

**MongoDB:** I tried using this database because I have experience with SQL databases, like Supabase, but other than that I don't have experience with NoSQL databases, so I wanted to further my understanding. I honestly enjoyed learning about MongoDB and using it, and it almost sometimes feels more simple because of the JSON feel to it rather than having to query with SQL. 

**Render:** Usually, I use Vercel to deploy, but I decided to deploy with Render because I haven't had experience with it yet, and also there are some backend positives that it provides compared to Vercel, and I was interested to see that I deploy the backend and frontend separately, one as a web service and one as a static site. 

---

## Technical Rationale

### Why this structure

I split the project into a `frontend/` (React + Vite) and a `backend/` (FastAPI) inside one repo. Both deploy as independent services (web service and static site) on Render, but live in the same repo so they share a git history. This keeps the boundary very clean. Anything that touches secrets lives on the backend, and the frontend never interacts with them. Another point about choosing MongoDB, I don't really need relational joins, so that's also another reason that I decided to use MongoDB instead of a SQL database (such as Supabase) for this project. 

### Biggest tradeoffs

**No authentication.** I didn't create authentication because I felt that there was no reason to have it, at least for now. The application doesn't have many users (obviously), and I can just cache their data on the web browser that they use with localstorage, leading to a lot easier of an onboarding process where they can start studying immediately rather than needing to login and all first, which to me doesn't really make senes to have users do (at least not right now while people aren't using the application). 

**Cached AI explanations** Originally every "Get deeper explanation" click hit OpenAI. After a few clicks I realized I was paying for the same response repeatedly. I added a `cached_explanations` MongoDB collection that stores the AI response on first request and serves it on every subsequent request. The endpoint went from ~3.7 seconds to ~30ms on cache hits, and I also don't need to pay for every single API hit if there are already explanations for a specific problem in the cache. 

**Priority queue for recommendations.** I considered three approaches: sort all problems by score, push everything into a heap, or use a heap of patterns with re-insertion to interleave. I went with a single heap of all 112 problems with a `random.random()` tiebreaker (O(N log N)). 

### Hardest bug I encountered

**TLS handshake errors that turned out to be IP allowlisting.**

While running the database seed script, I started getting TLS errors. 

The error mentions SSL, TLS, and a handshake failure, so I spent twenty minutes thinking it was a certificate problem. I installed `certifi`, passed `tlsCAFile=certifi.where()` to `MongoClient` (had to look this up and figure it out as I hadn't really dealt with this before).

None of it worked. The actual cause was that I'd switched WiFi networks, my public IP had changed, and MongoDB Atlas's network access list no longer included my new IP. I didn't know this because I hadn't used MongoDB before, so then I just changed the allowed IPs instead of just using my personal one.

The fix was literally thirty seconds, which I just added `0.0.0.0/0` to the Atlas allowlist. 

---

## AI Usage

I used Claude Code for the frontend, as I wanted to focus on manually creating the backend instead of focusing entirely on both the frontend and backend. I manually created the backend though as I wanted to learn more and solidify my understanding creating endpoints. 

### What I used AI for

I did the backend by myself, and I used AI for the frontend. 

### Specific prompt example and how I adapted the output

**My prompt** (paraphrased, this came up with adding the Monaco code editor.):

> "Instead of just having a simple textarea for the code editor in PracticeMode, I want to replace it with the Monaco code editor. Default language should be Python. It should fit cleanly inside of the existing card layout in App.jsx."

Claude installed the packages, imported it, and replaced the textarea with an Editor component. The structure worked but I had to adapt the output in a few different ways: 

1. Default options were cluttered
    - When I added Monaco, it was very cluttered and looked like a mini IDE window, so I added an options object turning off the minimap and tweaking padding so that the editor felt more focused and more like a workspace. 
2. Dead code that served no purpose from the previous version: 
    - The manual handler that I originally had was broken because we switched it to using monaco, so I had to delete that dead code that Claude didn't clean up.
3. The height was set to a percentage instead of a pixel value. 
    - The first version had height = 100% which would just become 0 because the parent div didn't have a defined height, so I set the height to 360px instead of a percentage value. 
4. onChange could pass undefined.
    - Claude wrote this code - onchange={(value) => setCode(value)} which could pass undefined and could throw an error as other code was using it, so I changed it to this - onchange = {(value) => setCode(value ?? '')} which made it safer. 

    Point is, for the frontend Claude made it quick and obviously made it look nice, but at the same time it didn't clean up some code which I had to manually edit to make this work and make sure that there was no dead code that didn't serve a purpose and would confuse people when reading the code. 


