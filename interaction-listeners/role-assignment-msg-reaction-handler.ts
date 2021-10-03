import { TextChannel, Client, MessageReaction, User } from "discord.js";
import { ClientListeners } from "./index";
import {
  BARUCH_GUILD_ID,
  ROLE_ASSIGNMENT_CHANNEL_ID,
  ROLE_ASSIGNMENT_MESSAGE_ID,
  VISITOR_ROLE_ID,
  STUDENT_ROLE_ID,
  GRAD_STUDENT_ROLE_ID,
  ALUMNI_ROLE_ID,
  CORE_ROLES,
  UNKNOWN_ROLE_ID,
} from "../assets/constants";

const EMOJI_NAME_TO_ROLE = new Map<string, string>();
EMOJI_NAME_TO_ROLE.set("1️⃣", STUDENT_ROLE_ID);
EMOJI_NAME_TO_ROLE.set("2️⃣", GRAD_STUDENT_ROLE_ID);
EMOJI_NAME_TO_ROLE.set("3️⃣", ALUMNI_ROLE_ID);
EMOJI_NAME_TO_ROLE.set("4️⃣", VISITOR_ROLE_ID);

export default class RoleAssignmentMsgReactionHandler extends ClientListeners {
  private client: Client;
  constructor() {
    super("ready");

    this.handler = this.handler.bind(this);
    this.reactionHandler = this.reactionHandler.bind(this);
  }

  async reactionHandler(reaction: MessageReaction, user: User): Promise<void> {
    const baruchGuild = await this.client.guilds.fetch(BARUCH_GUILD_ID);
    const member = baruchGuild.members.cache.get(user.id);
    // Give member the role they clicked on, and remove any other CORE_ROLES
    const properRoleId: string = EMOJI_NAME_TO_ROLE.get(reaction.emoji.name);
    if (!properRoleId) {
      console.error(
        `Someone reacted with an emoji that isn't there? ${reaction.emoji.name}`
      );
      return;
    }
    await member.roles.add(properRoleId);
    const coreRolesWithoutProperRole = CORE_ROLES.filter(
      (roleId) => roleId !== properRoleId
    );
    await member.roles.remove([...coreRolesWithoutProperRole, UNKNOWN_ROLE_ID]);

    // Then remove the users other reactions to this message
    const otherReactions = await reaction.message.reactions.cache.filter(
      (r) => r.emoji.name !== reaction.emoji.name
    );
    otherReactions.forEach((r) => r.users.remove(user));
  }

  async handler(client: Client): Promise<void> {
    this.client = client;

    // When bot is ready, create a message reaction handler to listen for and respond to reactions
    // const roleAssignmentChannel = client.channels.cache.get(
    //   ROLE_ASSIGNMENT_CHANNEL_ID
    // ) as TextChannel;894047043897675786
    const roleAssignmentChannel = client.channels.cache.get(
      "894047043897675786"
    ) as TextChannel;

    // const msg = await roleAssignmentChannel.messages.fetch(
    //   ROLE_ASSIGNMENT_MESSAGE_ID
    // );
    const msg = await roleAssignmentChannel.messages.fetch(
      "894047099107299328"
    );

    msg.createReactionCollector().on("collect", this.reactionHandler);
  }
}
