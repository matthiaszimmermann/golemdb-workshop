import random
import os

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

class Throw(BaseModel):
    dice: list[int]
    sum: int


app = FastAPI()

# Add CORS middleware BEFORE defining routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: Please remove this line and use Golem DB to store the data
data: list[Throw] = []

@app.get("/")
async def root():
    return {"message": "Hello on Golem DB Workshop!"}

@app.get("/api/v1/me")
async def get_me():
    return {os.getenv("PLAYER_NAME")}


# TODO: This endpoint should return the throws from the Golem DB
# It's up to you if you query by owner address or by some entity annotations
@app.get("/api/v1/throws")
async def get_throws() -> list[Throw]:
    return data


# TODO: This endpoint should store the throw in the Golem DB.
# If there is already 10 throws, you should remove the oldest ones to keep only 10.
# Use annotations as you wish but please keep two of them like:
# projectId: "golem-db-workshop"
# player: <player_name>
# This will help with realising extra feature like ranking of best players.
@app.post("/api/v1/throws")
async def post_throws() -> Throw:
    roll = [random.randint(1, 6) for _ in range(5)]
    throw = Throw(dice=roll, sum=sum(roll))
    data.append(throw)
    return throw
