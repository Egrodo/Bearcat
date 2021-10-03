import path from "path";
import { promises as fsPromises } from "fs";

export abstract class ClientListeners {
  public event: string;

  constructor(eventType: string) {
    this.event = eventType;
  }

  abstract handler(...any): Promise<void>;
}

async function getListeners(): Promise<Array<ClientListeners>> {
  const listenerFileNames = await fsPromises.readdir(__dirname);
  const listenerImportPromises = [];
  for (let i = 0; i < listenerFileNames.length; ++i) {
    const cmdFilename = listenerFileNames[i];
    if (cmdFilename.includes("index")) continue;
    const commandPath = path.join(__dirname, cmdFilename);
    listenerImportPromises.push(require(commandPath).default);
  }

  const listeners = (await Promise.all(listenerImportPromises)).map(
    (Listener) => new Listener()
  );
  return listeners;
}

export default getListeners;
