import os
import certifi
import heapq
import random
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

class CodeEvalRequest(BaseModel):
    pattern: str
    prompt: str
    code: str

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
    cached = db.cached_explanations.find_one({"problem_id": problem_id})
    if cached:
        return {"explanation": cached["explanation"], "cached": True}

    problem = db.problems.find_one({"id": problem_id}, {"_id": 0})
    if problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")
    prompt = f"""Explain the algorithmic pattern '{problem["pattern"]}' as it applies to the problem '{problem["title"]}' for a learner studying coding interviews. Focus on the intuition and when to recognize this pattern. Keep your response under 50 words."""
    response = openai_client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = [{"role": "user", "content": prompt}]
    )
    text = response.choices[0].message.content

    db.cached_explanations.insert_one({
        "problem_id": problem_id,
        "explanation": text,
        "created_at": datetime.utcnow()
    })

    return {"explanation": text, "cached": False}

@app.post("/api/attempts")
def record_attempt(attempt: AttemptIn):
    problem = db.problems.find_one({"id": attempt.problem_id}, {"_id": 0})
    if problem is None:                                                                                                                             
        raise HTTPException(status_code=404, detail="Problem not found")
    record = {
        "session_id": attempt.session_id,
        "problem_id": attempt.problem_id,                                                                                                           
        "selected": attempt.selected,
        "correct": attempt.selected == problem["pattern"],                                                                                          
        "pattern": problem["pattern"],                                                                                                              
        "timestamp": datetime.utcnow(),
    }
    db.attempts.insert_one(record)
    return {"ok": True}

@app.get("/api/stats")
def get_stats(session: str):                                                                                                                        
    pipeline = [
        {"$match": {"session_id": session}},                                                                                                        
        {"$group": {                                      
            "_id": "$pattern",
            "total": {"$sum": 1},
            "correct": {"$sum": {"$cond": ["$correct", 1, 0]}},                                                                                     
        }},
        {"$project": {                                                                                                                              
            "pattern": "$_id",                            
            "total": 1,
            "correct": 1,                                                                                                                           
            "success_rate": {"$divide": ["$correct", "$total"]},
            "_id": 0,                                                                                                                               
        }},                                               
        {"$sort": {"success_rate": 1}},
    ]                                                                                                                                               
    by_pattern = list(db.attempts.aggregate(pipeline))
                                                                                                                                                      
    total_attempts = db.attempts.count_documents({"session_id": session})                                                                           
    total_correct = db.attempts.count_documents({"session_id": session, "correct": True})
                                                                                                                                                      
    return {                                              
        "total_attempts": total_attempts,
        "total_correct": total_correct,
        "by_pattern": by_pattern,                                                                                                                   
    }

@app.post("/api/evaluate-code")                                                                                                                     
def evaluate_code(req: CodeEvalRequest):                  
    eval_prompt = f"""You are a coding interview tutor. A learner is practicing the '{req.pattern}' algorithmic pattern.
                                                                                                                                                    
Problem they are solving:
{req.prompt}                                                                                                                                        
                                                                                                                                                    
Their code:
{req.code}                                                                                                                                          
                                                        
Evaluate their submission concisely (under 200 words). Address:
1. Does the code correctly implement the {req.pattern} pattern? (yes / no / partially)
2. Does it solve the problem correctly? (yes / no / partially)                                                                                      
3. What is done well?
4. What bugs or improvements should they consider?                                                                                                  
                                                                                                                                                    
Return plain readable feedback for the learner."""
                                                                                                                                                    
    response = openai_client.chat.completions.create(     
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": eval_prompt}],                                                                                        
    )
                                                                                                                                                    
    return {"feedback": response.choices[0].message.content}

@app.get("/api/problems/recommended")
def recommended_problems(session: str) -> list[Problem]:
    pipeline = [
        {"$match": {"session_id": session}},
        {"$group": {                                                                                                                                
            "_id": "$pattern",                            
            "total": {"$sum": 1},
            "correct": {"$sum": {"$cond": ["$correct", 1, 0]}},                                                                                     
        }}, 
    ]
    stats = list(db.attempts.aggregate(pipeline))
    pattern_rates = {s["_id"]: s["correct"] / s["total"] for s in stats}

    all_problems = list(db.problems.find({}, {"_id": 0}))

    heap = []
    for problem in all_problems:
        score = pattern_rates.get(problem["pattern"], 0.5)
        heapq.heappush(heap, (score, random.random(), problem))

    ordered = []
    while heap:
        _, _, p = heapq.heappop(heap)
        ordered.append(p)
    return ordered



if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 4000))
    uvicorn.run("server:app", host="127.0.0.1", port=port, reload=True)


