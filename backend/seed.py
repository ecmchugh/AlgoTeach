import os
from dotenv import load_dotenv
from pymongo import MongoClient
from problems_data import PROBLEMS

load_dotenv()

client = MongoClient(os.environ["MONGODB_URI"])
db = client.get_default_database()

for problem in PROBLEMS:
    db.problems.update_one(
        {"id": problem["id"]},
        {"$set": problem},
        upsert = True
    )

print(f"Seeded {len(PROBLEMS)} problems into {db.name}.problems")
client.close()