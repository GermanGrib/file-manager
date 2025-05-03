import readline from 'node:readline';
import {stdin as input, stdout as output} from 'node:process'

const concierge = (username) => {
  console.log(`Welcome to the File Manager, ${username}!`);
  const rl = readline.createInterface({
    input,
    output,
    prompt: '> '
  })
  rl.prompt();
  
  rl.on('line', (line) => {
    const command = line.trim()
    if (command === '.exit') {
      conciergeFarewell(rl, username)
    }
  })
  
  rl.on('SIGINT', () => {
    conciergeFarewell(rl, username);
  })
  
};

const conciergeFarewell = (rl, username) => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  rl.close();
}

export default concierge;