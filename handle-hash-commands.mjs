import {resolve} from 'node:path';
import {createReadStream} from 'node:fs'
import {createHash} from 'node:crypto'

const handleHashCommands = async(command) => {
  switch (true) {
    case command.startsWith("hash "):
      await calculateFileHash(command.slice(5))
      break
  }
}

const calculateFileHash = async (filePath) => {
  const resolvedPath = resolve(filePath);
  const hash = createHash('sha256');
  const stream = createReadStream(resolvedPath);
  
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => {
      const hexHash = hash.digest('hex');
      console.log(`Hash ${hexHash}\nFor file: ${filePath}`);
      resolve();
    });
    stream.on('error', error => {
      console.error(`Operation failed: ${error.message}`);
      reject(error);
    });
  });
};

export default handleHashCommands