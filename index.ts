import { Client, Intents } from "discord.js";
import cron from "node-cron";
import { token } from "./config.json";
import getInteractionListeners from "./interaction-listeners";

// TODO: Could do the same auto-populate-index thing for manual listeners later.
import autoPingUnknownUsers from "./manual-listeners/auto-ping-unknown-users";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

getInteractionListeners().then((listeners) => {
  listeners.forEach((listener) => {
    client.on(listener.event, listener.handler);
  });
  client.login(token);
});

cron.schedule("0 0 * * *", () => autoPingUnknownUsers(client));

export default client;
