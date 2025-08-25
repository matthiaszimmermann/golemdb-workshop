from golem_base_sdk import EntityKey, GenericBytes, GolemBaseClient
import asyncio

async def hello_world():
    client = await GolemBaseClient.create_ro_client(
        "https://kaolin.holesky.golem-base.io/rpc", 
        "wss://kaolin.holesky.golem-base.io/rpc/ws"
    )
    print(await client.get_storage_value(GenericBytes.from_hex_string("0xcc3fc30039bd5b5abcaeaae25eea2e536e429d93fa06109888c459e7b55bc878")))
    await client.disconnect()

asyncio.run(hello_world())

