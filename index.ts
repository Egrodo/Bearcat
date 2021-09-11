import { Client, Intents } from "discord.js";
import { token } from "./config.json";
import listeners from "./listeners";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

listeners.forEach((listener) => {
  client.on(listener.event, listener.handler);
});

client.login(token);

export default client;
