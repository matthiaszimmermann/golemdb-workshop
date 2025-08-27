import { Hono } from 'hono'

const app = new Hono()

interface DiceThrow {
  dice: number[]
  sum: number
}

const data: DiceThrow[] = []

app.get('/', (c) => {
  return c.text('Hello on Golem DB Workshop!')
})

app.get('/api/v1/me', (c) => {
  return c.text(process.env.PLAYER_NAME || 'default')
})

app.get('/api/v1/throws', (c) => {
  return c.json(data)
})

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
  fetch: app.fetch,
}
