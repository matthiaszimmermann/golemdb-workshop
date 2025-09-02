import { createROClient } from "golem-base-sdk";

const client = createROClient(
    60138453025,
    "https://ethwarsaw.holesky.golemdb.io/rpc",
    "wss://ethwarsaw.holesky.golemdb.io/rpc/ws"
);

const decoder = new TextDecoder();
client.getStorageValue("0xf4888ec1ffb3f8bc794f6f0d61b887e2bd3d0ac9e81f8ba63807d1f3497285ee").then(value => {
    console.log(decoder.decode(value));
});

