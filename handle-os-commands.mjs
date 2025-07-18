import {EOL, cpus, homedir, userInfo, arch} from 'node:os';

const handleOsCommands = async (command) => {
  switch (true) {
    case command === "os --EOL":
      const osName = JSON.stringify(EOL) === '"\\n"' ? 'POSIX' : 'Windows';
      console.log(`System line ending: ${JSON.stringify(EOL)}`);
      console.log(`Detected OS: ${osName}`);
      break
    
    case command === "os --cpus":
      const cpuData = cpus()
      console.log(`Total cpus: ${cpuData.length}`);
      
      cpuData.forEach((cpu,inx) => {
        console.log(`\nCPU ${inx + 1}:`);
        console.log(`- Model: ${cpu.model}`);
        console.log(`- Clock Rate: ${(cpu.speed / 1000).toFixed(2)} GHz`);
      })
      break
    
    case command === "os --homedir":
      console.log(`Homedir: ${homedir()}`);
      break
    
    case command === "os --username":
      console.log(`Username: ${userInfo().username}`);
      break
    
    case command === "os --architecture":
      const architecture = arch();
      console.log(`Node.js compiled for: ${architecture}`);
      break
  }
}

export default handleOsCommands