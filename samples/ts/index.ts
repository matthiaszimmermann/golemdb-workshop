import { createROClient } from "golem-base-sdk";

const client = createROClient(
    60138453025,
    "https://kaolin.holesky.golem-base.io/rpc",
    "wss://kaolin.holesky.golem-base.io/rpc/ws"
);

const decoder = new TextDecoder();
client.getStorageValue("0xcc3fc30039bd5b5abcaeaae25eea2e536e429d93fa06109888c459e7b55bc878").then(value => {
    console.log(decoder.decode(value));
});

