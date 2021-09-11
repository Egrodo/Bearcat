import { Collection } from "discord.js";

import adminMsg from "./admin-msg";
import setMajor from "./set-major";

const collection = new Collection<string, any>();
collection.set(adminMsg.data.name, adminMsg);

collection.set(setMajor.data.name, setMajor);

export default collection;
