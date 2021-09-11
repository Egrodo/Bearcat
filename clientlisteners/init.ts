import commands from "../commands";
import { Client } from "discord.js";
import { Routes } from "discord-api-types/v9";
import { clientId, guildId, token } from "../config.json";
import { REST } from "@discordjs/rest";
import ClientListeners from "../utils/client-listener";

const rest = new REST({ version: "9" }).setToken(token);

async function deployCommands(client: Client) {
  if (commands.size === 0) {
    console.error("There are no commands to register, exiting");
    return;
  }
  const guild = await client.guilds.fetch(guildId);

  try {
    const cmdData: any = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {
        body: commands.map((command) => command.data.toJSON()),
      }
    );

    // Set permissions for each command if applicable
    for (const command of cmdData) {
      const { id, name } = command;
      const cmd = await guild.commands.fetch(id);
      const { allowedRoles } = commands.get(name);
      if (allowedRoles == null) continue; // No permissions to set for this command
      const permissions = allowedRoles.map((roleId) => ({
        id: roleId,
        type: 1,
        permission: true,
      }));
      await cmd.permissions.add({ permissions });
    }
  } catch (error) {
    console.error(error);
  }
}

export default class Init extends ClientListeners {
  constructor() {
    super("ready");
  }

  async handler(client: Client): Promise<void> {
    console.log("Starting...");
    await deployCommands(client);
    console.log("Deployed Commands");
  }
}
