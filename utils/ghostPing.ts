import { TextChannel, GuildMember, Formatters } from "discord.js";
import awaitTimeout from "../utils/awaitTimeout";

export default async (channel: TextChannel, userToPing: GuildMember) => {
  const msg = await channel.send(`${Formatters.userMention(userToPing.id)}`);
  await awaitTimeout(500);
  msg.delete();
};
