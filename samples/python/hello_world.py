from golem_base_sdk import GenericBytes, GolemBaseClient
import asyncio

async def hello_world():
    client = await GolemBaseClient.create_ro_client(
        "https://ethwarsaw.holesky.golemdb.io/rpc", 
        "wss://ethwarsaw.holesky.golemdb.io/rpc/ws"
    )
    print(await client.get_storage_value(GenericBytes.from_hex_string("0xda66a86e61dd6bb570d62a59e8b9310e4cb2e89cb1215b8b8243ac4f6cffc4c3")))
    await client.disconnect()

asyncio.run(hello_world())

