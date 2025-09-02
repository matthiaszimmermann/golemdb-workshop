from golem_base_sdk import GenericBytes, GolemBaseClient
import asyncio

async def hello_world():
    client = await GolemBaseClient.create_ro_client(
        "https://ethwarsaw.holesky.golemdb.io/rpc", 
        "wss://ethwarsaw.holesky.golemdb.io/rpc/ws"
    )
    print(await client.get_storage_value(GenericBytes.from_hex_string("0xf4888ec1ffb3f8bc794f6f0d61b887e2bd3d0ac9e81f8ba63807d1f3497285ee")))
    await client.disconnect()

asyncio.run(hello_world())

