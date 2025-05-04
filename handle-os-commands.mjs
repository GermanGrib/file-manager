import {EOL, cpus} from 'node:os';

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
  }
}

export default handleOsCommands