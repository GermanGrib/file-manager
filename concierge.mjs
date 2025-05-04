import readline from 'node:readline';
import {stdin as input, stdout as output} from 'node:process'
import handleNavCommands from './handle-nav-commands.mjs';
import handleFsCommands from './handle-fs-commands.mjs';

const concierge = (username) => {
  console.log(`Welcome to the File Manager, ${username}!`);
  console.log(`You are currently in ${import.meta.dirname}`)
  const rl = readline.createInterface({
    input,
    output,
    prompt: '> '
  })
  rl.prompt();
  
  rl.on('line', async (line) => {
    const command = line.trim()
    
    try {
      switch (true) {
        case command === '.exit':
          conciergeFarewell(username, rl);
          break;
        
        case command === 'up':
        case command === 'ls':
        case command.startsWith('cd '):
          await handleNavCommands(command, rl)
          break
        
        case command.startsWith('cat '):
        case command.startsWith('add '):
        case command.startsWith('mkdir '):
        case command.startsWith('rn '):
        case command.startsWith('cp '):
        case command.startsWith('mv '):
        case command.startsWith('rm '):
          await handleFsCommands(command, rl)
          break
        
        default:
          console.log('Invalid input');
      }
      
    } catch (err) {
      console.log('Operation failed')
    }
    rl.prompt();
  })
  
  rl.on('SIGINT', () => {
    conciergeFarewell(username, rl);
  })
  
};

const conciergeFarewell = (username, rl) => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  rl.close();
}

export default concierge;