import logging
import os
import random

from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from golem_base_sdk import GolemBaseClient

ENV_PLAYER_NAME = "PLAYER_NAME"
ANONYMOUS_PLAYER = "anonymous"

ENV_RPC_URL = "RPC_URL"
ENV_WS_URL = "WS_URL"
ENV_PRIVATE_KEY = "PRIVATE_KEY"
RPC_URL_DEFAULT = "https://ethwarsaw.holesky.golemdb.io/rpc"
WS_URL_DEFAULT = "wss://ethwarsaw.holesky.golemdb.io/rpc/ws"
PRIVATE_KEY_DUMMY = "0x0000000000000000000000000000000000000000000000000000000000000001"


async def create_golemdb_client() -> GolemBaseClient | None:
    """Create and return a Golem DB client connected to the specified RPC and WS URLs using the provided private key."""
    try:
        # Convert hex string to bytes
        private_key_hex = PRIVATE_KEY.replace("0x", "")
        private_key_bytes = bytes.fromhex(private_key_hex)
        # Create client
        client = await GolemBaseClient.create_rw_client(
            rpc_url=RPC_URL, ws_url=WS_URL, private_key=private_key_bytes
        )
        owner_address = client.get_account_address()
        logger.info(f"Golem DB Client Connected with address: {owner_address}")
        
        # Get and check client account balance
        balance = await client.http_client().eth.get_balance(owner_address)
        logger.info(f"Golem DB Client account balance: {balance / 10**18} ETH")
        
        if balance == 0:
            logger.warning("Golem DB Client account balance is 0 ETH. Please acquire test tokens from the faucet.")
        
        return client

    # in case of an exception/error just return None
    except Exception as e:
        logger.error(f"Golem DB Error during client creation/connection (returning None): {e}")
        return None


# Global setup
load_dotenv()
logger = logging.getLogger("uvicorn.error")
client: GolemBaseClient | None = None

RPC_URL = os.getenv(ENV_RPC_URL, RPC_URL_DEFAULT)
WS_URL = os.getenv(ENV_WS_URL, WS_URL_DEFAULT)
PRIVATE_KEY = os.getenv(ENV_PRIVATE_KEY, PRIVATE_KEY_DUMMY)


class DiceThrow(BaseModel):
    dice: list[int]
    sum: int

# TODO: Please remove this line and use Golem DB to store the data
data: list[DiceThrow] = []


# Create FastAPI server
app = FastAPI()

@app.on_event("startup")
async def startup_event():
    """Initialize the Golem DB client when the FastAPI app starts up."""
    global client
    logger.info("Golem DB initializing client...")
    client = await create_golemdb_client()
    if client:
        logger.info("Golem DB client initialized successfully")
    else:
        logger.error("Golem DB client failed to initialize")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources when the FastAPI app shuts down."""
    global client
    if client:
        logger.info("Golem DB client closing connection...")
        # Add any cleanup logic here if needed by the SDK
        client = None


@app.get("/")
async def root():
    return {"message": "Hello from Golem DB Workshop!"}


@app.get("/api/v1/me")
async def get_me():
    return {os.getenv(ENV_PLAYER_NAME, ANONYMOUS_PLAYER)}


# TODO: This endpoint should return the throws from the Golem DB
# It's up to you if you query by owner address or by some entity annotations
@app.get("/api/v1/throws")
async def get_throws() -> list[DiceThrow]:
    return data


# TODO: This endpoint should store the throw in the Golem DB.
# If there is already 10 throws, you should remove the oldest ones to keep only 10.
# Use annotations as you wish but please keep two of them like:
# projectId: "golem-db-workshop"
# player: <player_name>
# This will help with realising extra feature like ranking of best players.
@app.post("/api/v1/throws")
async def post_throws() -> DiceThrow:
    roll = [random.randint(1, 6) for _ in range(5)]
    throw = DiceThrow(dice=roll, sum=sum(roll))
    data.append(throw)
    return throw
