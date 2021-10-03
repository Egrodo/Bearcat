import { GuildMember, TextChannel, Formatters } from "discord.js";
import { ClientListeners } from "./index";
import {
  ROLE_ASSIGNMENT_CHANNEL_ID,
  BARUCH_GUILD_ID,
} from "../assets/constants";
import awaitTimeout from "../utils/awaitTimeout";

export default class GhostPingOnjoin extends ClientListeners {
  constructor() {
    super("guildMemberAdd");
  }
  async handler(member: GuildMember): Promise<void> {
    const baruchGuild = await member.client.guilds.fetch(BARUCH_GUILD_ID);
    const channel = (await baruchGuild.channels.fetch(
      ROLE_ASSIGNMENT_CHANNEL_ID
    )) as TextChannel;

    const msg = await channel.send(`${Formatters.userMention(member.id)}`);
    await awaitTimeout(500);
    msg.delete();
  }
}
