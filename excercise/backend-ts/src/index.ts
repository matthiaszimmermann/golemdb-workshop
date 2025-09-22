import { 
  createClient, 
  GolemBaseClient,
  Tagged,
} from "golem-base-sdk";
import { Logger, ILogObj } from "tslog";
import { Hono } from 'hono'

const ANONYMOUS_PLAYER = "anonymous";

const CHAIN_ID_DEFAULT = 60138453033; 
const PRIVATE_KEY_DUMMY: string = "0x0000000000000000000000000000000000000000000000000000000000000001";
const RPC_URL_DEFAULT: string = "https://ethwarsaw.holesky.golemdb.io/rpc";
const WS_URL_DEFAULT: string = "wss://ethwarsaw.holesky.golemdb.io/rpc/ws";

const logger = new Logger<ILogObj>({
  name: "GolemDB Example",
  minLevel: 3 // Info and above
});


async function createGolemDbClient(): Promise<GolemBaseClient | null> {
  try {
    // Initialize client configuration
    const chainId = process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : CHAIN_ID_DEFAULT;
    const privateKeyHex = (process.env.PRIVATE_KEY || PRIVATE_KEY_DUMMY).replace(/^0x/, "");
    const privateKey = new Uint8Array(
      privateKeyHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );
    const rpcUrl = process.env.RPC_URL || RPC_URL_DEFAULT;
    const wsUrl = process.env.WS_URL || WS_URL_DEFAULT;
    
    // Create new Golem DB client
    const client: GolemBaseClient = await createClient(
      chainId, new Tagged("privatekey", privateKey), rpcUrl, wsUrl, logger);
    const ownerAddress = await client.getOwnerAddress();
    logger.info(`Golem DB Client Connected with address: ${ownerAddress}`);

    // Get and check client account balance
    const balanceBigint = await client.getRawClient().httpClient.getBalance({ address: ownerAddress });
    const balance = Number(balanceBigint) / 10**18;
    logger.info(`Golem DB Client account balance: ${balance} ETH`);

    if (balance === 0) {
      logger.warn("Golem DB Client Warning: Account balance is 0 ETH. Please acquire test tokens from the faucet.");
    }

    return client;
  } catch (error) {
    logger.error(`Golem DB Client. Error during client creation/connection (returning null): ${error}`);
    return null;
  }
}


// Global setup
let client: GolemBaseClient | null = null;

interface DiceThrow {
  dice: number[]
  sum: number
}

// TODO: Please remove this line and use Golem DB to store the data
const data: DiceThrow[] = []


// Create Hono server
const app = new Hono()

// Initialize the global client at startup
async function initializeServer() {
  logger.info("Initializing Golem DB client...");
  client = await createGolemDbClient();
  if (client) {
    logger.info("Golem DB client initialized successfully");
  } else {
    logger.error("Golem DB client failed to initialize");
  }
}


// Wrapper to handle client initialization
async function handleRequest(request: Request): Promise<Response> {
  // Initialize client on first request if not already done
  if (client === null) {
    logger.info("Client is null, initializing...");
    await initializeServer();
  } else {
    logger.debug("Client already initialized");
  }

  // Forward the request to the app
  return app.fetch(request);
}


app.get('/', (c) => {
  return c.text('Hello from Golem DB Workshop!')
})

app.get('/api/v1/me', (c) => {
  return c.json(process.env.PLAYER_NAME || ANONYMOUS_PLAYER)
})

// TODO: This endpoint should return the throws from the Golem DB
// It's up to you if you query by owner address or by some entity annotations
app.get('/api/v1/throws', (c) => {
  return c.json(data)
})

// TODO: This endpoint should store the throw in the Golem DB.
// If there is already 10 throws, you should remove the oldest ones to keep only 10.
// Use annotations as you wish but please keep two of them like:
// projectId: "golem-db-workshop"
// player: <player_name>
// This will help with realising extra feature like ranking of best players.
app.post('/api/v1/throws', (c) => {
  const roll = Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1);
  const diceThrow: DiceThrow = {
    dice: roll,
    sum: roll.reduce((a, b) => a + b, 0)
  };
  data.push(diceThrow);
  return c.json(diceThrow);
})

export default {
  port: 8000,
  fetch: handleRequest,
}
