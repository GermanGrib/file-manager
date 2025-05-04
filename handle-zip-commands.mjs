import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { basename, join} from 'node:path';
import {createReadStream, createWriteStream} from "node:fs"

const handleZipCommands = async (command) => {
  switch (true) {
    case command.startsWith('compress '):
      await compressFile(command.slice(9));
      break
    
    case command.startsWith('decompress '):
      await decompressFile(command.slice(11));
      break
  }
}

const compressFile = async (paths) => {
  const [sourcePath, destPath] = paths.trim().split(/\s+/);
  
  if (!sourcePath || !destPath) {
    throw new Error('Invalid arguments: provide both source and destination paths');
  }
  
  let finalDestPath = destPath;
  if (destPath.endsWith('/') || !destPath.includes('.')) {
    finalDestPath = join(destPath, `${basename(sourcePath)}.gz`);
  }
  
  const inp = createReadStream(sourcePath);
  const out = createWriteStream(finalDestPath);
  
  inp.pipe(createBrotliCompress()).pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log(`Successfully compressed to: ${finalDestPath}`);
      resolve();
    });
    out.on('error', reject);
    inp.on('error', reject);
  });
}

const decompressFile = async (paths) => {
  const [sourcePath, destPath] = paths.trim().split(/\s+/);
  
  if (!sourcePath || !destPath) {
    throw new Error('Invalid arguments: provide both source and destination paths');
  }
  
  let finalDestPath = destPath;
  if (destPath.endsWith('/') || !destPath.includes('.')) {
    const rawName = basename(sourcePath).replace(/\.(gz|br)$/, '');
    finalDestPath = join(destPath, rawName);
  }
  
  const inp = createReadStream(sourcePath);
  const out = createWriteStream(finalDestPath);
  
  inp.pipe(createBrotliDecompress()).pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log(`Successfully decompressed to: ${finalDestPath}`);
      resolve();
    });
    out.on('error', reject);
    inp.on('error', reject);
  });
};


export default handleZipCommands;