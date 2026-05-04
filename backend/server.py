import os
import certifi
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime

load_dotenv()

client = MongoClient(os.environ["MONGODB_URI"], tlsCAFile=certifi.where())
db = client.get_default_database()

openai_client = OpenAI()

class Problem(BaseModel):
    id: str
    title: str
    prompt: str
    pattern: str
    choices: list[str]
    explanation: str
    clues: list[str]
    complexity: str

class AttemptIn(BaseModel):
    session_id: str
    problem_id: str
    selected: str

app = FastAPI(title="AlgoTeach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"ok": True}

@app.get("/api/problems")
def list_problems() -> list[Problem]:
    return list(db.problems.find({}, {"_id": 0}))

@app.get("/api/problems/{problem_id}/explain-deeper")
def explain_deeper(problem_id: str):
    problem = db.problems.find_one({"id": problem_id}, {"_id": 0})
    if problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")
    prompt = f"""Explain the algorithmic pattern '{problem["pattern"]}' as it applies to the problem '{problem["title"]}' for a learner studying coding interviews. Focus on the intuition and when to recognize this pattern. Keep your response under 50 words."""
    response = openai_client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = [{"role": "user", "content": prompt}]
    )

    return {"explanation": response.choices[0].message.content}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 4000))
    uvicorn.run("server:app", host="127.0.0.1", port=port, reload=True)


