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

data: list[Throw] = []

@app.get("/")
async def root():
    return {"message": "Hello on Golem DB Workshop!"}

@app.get("/api/v1/me")
async def get_me():
    return {os.getenv("PLAYER_NAME")}


@app.get("/api/v1/throws")
async def get_throws() -> list[Throw]:
    return data


@app.post("/api/v1/throws")
async def post_throws() -> Throw:
    roll = [random.randint(1, 6) for _ in range(5)]
    throw = Throw(dice=roll, sum=sum(roll))
    data.append(throw)
    return throw
