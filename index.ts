import { Client, Intents } from "discord.js";
import { token } from "./config.json";
import getInteractionListeners from "./interaction-listeners";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

getInteractionListeners().then((listeners) => {
  listeners.forEach((listener) => {
    client.on(listener.event, listener.handler);
  });
  client.login(token);
});

export default client;
