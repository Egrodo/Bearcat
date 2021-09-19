import path from "path";
import { promises as fsPromises } from "fs";
import { Collection } from "discord.js";

async function getCommands() {
  const collection = new Collection<string, any>();
  const commandFileNames = await fsPromises.readdir(__dirname);
  const commandImportPromises = [];
  for (let i = 0; i < commandFileNames.length; ++i) {
    const cmdFilename = commandFileNames[i];
    if (cmdFilename.includes("index")) continue;
    const commandPath = path.join(__dirname, cmdFilename);
    commandImportPromises.push(require(commandPath).default);
  }

  const commands = await Promise.all(commandImportPromises);
  commands.forEach((command) => collection.set(command.data.name, command));

  return collection;
}

export default getCommands;
