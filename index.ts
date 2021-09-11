import { Client, Intents } from "discord.js";
import { token } from "./config.json";
import listeners from "./clientlisteners";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

listeners.forEach((listener) => {
  console.log(listener.event, listener.handler);
  client.on(listener.event, listener.handler);
});

client.login(token);

export default client;
