import path from "path";
import { promises as fsPromises } from "fs";
import ClientListeners from "../utils/client-listener-type";

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
