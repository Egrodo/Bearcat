import { Message } from "discord.js";
import ClientListeners from "../utils/client-listener";

export default class MajorAssignmentClearer extends ClientListeners {
  constructor() {
    super("messageCreate");
  }

  async handler(message: Message): Promise<void> {
    console.log(message.content);
  }
}
