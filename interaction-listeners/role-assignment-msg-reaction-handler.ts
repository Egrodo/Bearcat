import {
  TextChannel,
  Client,
  MessageReaction,
  User,
  Collection,
  Role,
} from "discord.js";
import { Snowflake } from "discord-api-types";
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
  private currentRunRequests: Map<string, Promise<void>[]> = new Map();

  constructor() {
    super("ready");

    this.handler = this.handler.bind(this);
    this.reactionHandler = this.reactionHandler.bind(this);
  }

  async reactionHandler(reaction: MessageReaction, user: User): Promise<void> {
    if (this.currentRunRequests.has(user.id)) {
      // Wait until the last runs are done first
      const lastRuns = this.currentRunRequests.get(user.id);
      await Promise.all(lastRuns);
      this.currentRunRequests.delete(user.id);
    }
    const wrappedPromise = new Promise<void>(async (resolve, reject) => {
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

      const newRoles = new Collection<Snowflake, Role>();
      member.roles.cache.forEach((role) => {
        if (!CORE_ROLES.includes(role.id) && role.id !== UNKNOWN_ROLE_ID) {
          newRoles.set(role.id, role);
        }
      });

      newRoles.set(properRoleId, baruchGuild.roles.cache.get(properRoleId));

      await member.roles.set(newRoles);

      // Then remove the users other reactions to this message
      const otherReactions = reaction.message.reactions.cache.filter(
        (r) => r.emoji.name !== reaction.emoji.name
      );

      const removalPromises = otherReactions.map(async (r) => {
        if (r.users.cache.has(user.id)) r.users.remove(user);
        return Promise.resolve();
      });

      Promise.all(removalPromises);

      resolve();
    });

    const currentRuns = this.currentRunRequests.get(user.id) || [];
    currentRuns.push(wrappedPromise);
    this.currentRunRequests.set(user.id, currentRuns);
  }

  async handler(client: Client): Promise<void> {
    this.client = client;

    // When bot is ready, create a message reaction handler to listen for and respond to reactions
    const roleAssignmentChannel = client.channels.cache.get(
      ROLE_ASSIGNMENT_CHANNEL_ID
    ) as TextChannel;
    894047043897675786;

    const msg = await roleAssignmentChannel.messages.fetch(
      ROLE_ASSIGNMENT_MESSAGE_ID
    );

    msg.createReactionCollector().on("collect", this.reactionHandler);
  }
}
