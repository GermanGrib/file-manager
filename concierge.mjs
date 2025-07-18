import readline from 'node:readline';
import {homedir} from 'node:os'
import {chdir, exit, stdin as input, stdout as output} from 'node:process'
import handleNavCommands from './handle-nav-commands.mjs';
import handleFsCommands from './handle-fs-commands.mjs';
import handleOsCommands from './handle-os-commands.mjs';
import handleHashCommands from './handle-hash-commands.mjs';
import handleZipCommands from './handle-zip-commands.mjs';
import logDirChangedTo from './utils/log-dir-change-to.mjs';

const concierge = (username) => {
  console.log(`Welcome to the File Manager, ${username}!`);
  chdir(homedir())
  logDirChangedTo()
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
          return;
        
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
        
        case command === 'os --EOL':
        case command === 'os --cpus':
        case command === 'os --homedir':
        case command === 'os --username':
        case command === 'os --architecture':
          await handleOsCommands(command)
          break
        
        case command.startsWith('hash '):
          await handleHashCommands(command)
          break
        
        case command.startsWith('compress '):
        case command.startsWith('decompress '):
          await handleZipCommands(command)
          break
        
        default:
          console.log('Invalid input');
      }
      
    } catch (err) {
      console.log('Operation failed')
    } finally {
      logDirChangedTo()
      rl.prompt();
    }
  })
  
  rl.on('SIGINT', () => {
    conciergeFarewell(username, rl);
  })
  
};

const conciergeFarewell = (username, rl) => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  rl.close();
  exit(0);
}

export default concierge;