import { createROClient } from "golem-base-sdk";

const client = createROClient(
    60138453033,
    "https://ethwarsaw.holesky.golemdb.io/rpc",
    "wss://ethwarsaw.holesky.golemdb.io/rpc/ws"
);

const decoder = new TextDecoder();
client.getStorageValue("0xda66a86e61dd6bb570d62a59e8b9310e4cb2e89cb1215b8b8243ac4f6cffc4c3").then(value => {
    console.log(decoder.decode(value));
});

