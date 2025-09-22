import { createROClient } from "golem-base-sdk";

// Create a read-only Golem DB client
const client = createROClient(
    60138453033,
    "https://ethwarsaw.holesky.golemdb.io/rpc",
    "wss://ethwarsaw.holesky.golemdb.io/rpc/ws"
);
console.log(`Golem DB Client created.`);

// Fetch and print entity data for a specific entity key
// Compare in explorer: https://explorer.ethwarsaw.holesky.golemdb.io/entity/0xda66a86e61dd6bb570d62a59e8b9310e4cb2e89cb1215b8b8243ac4f6cffc4c3?tab=index"
const entityKey = "0xda66a86e61dd6bb570d62a59e8b9310e4cb2e89cb1215b8b8243ac4f6cffc4c3"
client.getStorageValue(entityKey).then(value => {
    const decoder = new TextDecoder();
    const entityData = decoder.decode(value);
    console.log(`Entity data: ${entityData}`);
});

