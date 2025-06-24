import concierge from './concierge.mjs';

const usernameArg = process.argv.find(arg => arg.startsWith('--username='));
const userName = usernameArg ? usernameArg.split('=')[1] : 'spy';

concierge(userName)