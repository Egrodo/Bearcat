import { Message } from "discord.js";
import ClientListeners from "../utils/client-listener-type";
import {
  ADMIN_ROLE_ID,
  MAJOR_ASSIGNMENT_CHANNEL_ID,
} from "../assets/constants";

export default class MajorAssignmentClearer extends ClientListeners {
  constructor() {
    super("messageCreate");
  }

  async handler(message: Message): Promise<void> {
    if (message.channelId !== MAJOR_ASSIGNMENT_CHANNEL_ID) return;
    if (message.author.bot || message.member.roles.highest.id === ADMIN_ROLE_ID)
      return;
    message.delete();
  }
}
