import MajorAssignmentClearer from "./major-assignment-clearer";
import CommandRunner from "./command-runner";
import Init from "./init";
import ClientListeners from "../utils/client-listener";

const listeners = new Array<ClientListeners>();
listeners.push(new Init());
listeners.push(new CommandRunner());
listeners.push(new MajorAssignmentClearer());

export default listeners;
