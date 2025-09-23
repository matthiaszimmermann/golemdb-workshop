import asyncio

from eth_account import Account
from golem_base_sdk import GenericBytes, GolemBaseClient

ENTITY_KEY = "0xda66a86e61dd6bb570d62a59e8b9310e4cb2e89cb1215b8b8243ac4f6cffc4c3"

async def hello_world():
    # Create a Golem DB client
    account = Account.create()
    client = await GolemBaseClient.create(
        "https://ethwarsaw.holesky.golemdb.io/rpc", 
        "wss://ethwarsaw.holesky.golemdb.io/rpc/ws",
        # For local containerized node:
        # "http://localhost:8545",
        # "ws://localhost:8546",
        account.key.hex()
    )

    connected = await client.is_connected()
    print(f"Golem DB Client created (connected: {connected})")

    # Fetch and print entity data for a specific entity key
    # Compare in explorer: https://explorer.ethwarsaw.holesky.golemdb.io/entity/0xda66a86e61dd6bb570d62a59e8b9310e4cb2e89cb1215b8b8243ac4f6cffc4c3?tab=index"
    entity_key = GenericBytes.from_hex_string(ENTITY_KEY)
    entity_data = await client.get_storage_value(entity_key)
    print(f"Entity data: {entity_data}")

    # Disconnect the client
    await client.disconnect()
    print("Golem DB Client disconnected")

asyncio.run(hello_world())

