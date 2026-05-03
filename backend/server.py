import os
import certifi
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient

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


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 4000))
    uvicorn.run("server:app", host="127.0.0.1", port=port, reload=True)


