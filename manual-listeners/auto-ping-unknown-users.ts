import { Client, Formatters, TextChannel } from "discord.js";
import {
  BARUCH_GUILD_ID,
  UNKNOWN_ROLE_ID,
  ROLE_ASSIGNMENT_CHANNEL_ID,
} from "../assets/constants";
import awaitTimeout from "../utils/awaitTimeout";

// Invoked by a regular cronjob, this pings all users in the unknown role to annoy them into picking a role
export default async function autoPingUnknownUsers(client: Client) {
  const baruchGuild = await client.guilds.fetch(BARUCH_GUILD_ID);
  const channel = (await baruchGuild.channels.fetch(
    ROLE_ASSIGNMENT_CHANNEL_ID
  )) as TextChannel;

  const msg = await channel.send(`${Formatters.roleMention(UNKNOWN_ROLE_ID)}`);
  await awaitTimeout(500);
  msg.delete();
}
