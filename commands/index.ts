import { Collection } from "discord.js";

import adminMsg from "./admin-msg";
import setMajor from "./set-major";
import ping from "./ping";

const collection = new Collection<string, any>();
collection.set(adminMsg.data.name, adminMsg);
collection.set(setMajor.data.name, setMajor);
collection.set(ping.data.name, ping);

export default collection;
