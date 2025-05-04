import {createReadStream, createWriteStream} from 'node:fs';
import {writeFile, mkdir, rename, access, unlink} from 'node:fs/promises'
import {resolve, basename} from 'node:path';
import {pipeline} from 'node:stream/promises';


const handleFsCommands = async (command) => {
  switch (true) {
    case command.startsWith('cat '):
      await logFile(command.slice(4))
      break
    
    case command.startsWith('add '):
      await createFile(command.slice(4))
      break
    
    case command.startsWith('mkdir '):
      await createDirectory(command.slice(6))
      break
    
    case command.startsWith('rn '):
      await renameFile(command.slice(3))
      break
    
    case command.startsWith('cp '):
      await copyFile(command.slice(3))
      break
    
    case command.startsWith('mv '):
      await moveFile(command.slice(3))
      break
  }
}

const logFile = async (pathToFile) => {
  try {
    const filePath = resolve(pathToFile.trim());
    const stream = createReadStream(filePath, {encoding: 'utf8', autoClose: true});
    await pipeline(stream, process.stdout)
  } catch (err) {
    console.error(err.message);
  }
}

const createFile = async (fileName) => {
  try {
    const filePath = resolve(fileName);
    await writeFile(filePath, '', {flag: 'wx'})
    console.log(`File created: ${filePath}`);
    
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.error('Operation failed: File already exists');
    } else {
      console.error('Operation failed:', err.message);
    }
  }
}

const createDirectory = async (newDirName) => {
  try {
    const dirPath = resolve(newDirName.trim());
    await mkdir(dirPath);
    console.log(`Directory created: ${newDirName}`);
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.error('Operation failed: Directory already exists');
    } else if (err.code === 'ENOENT') {
      console.error('Operation failed: Parent directory does not exist');
    } else {
      console.error('Operation failed:', err.message);
    }
  }
}

const renameFile = async (filesNames) => {
  try {
    const [oldFileName, newFileName] = filesNames.trim().split(/\s+/).slice(0, 2);
    
    if (!oldFileName || !newFileName) {
      console.error('Invalid arguments: provide both old and new filenames');
    }
    const oldPath = resolve(oldFileName);
    const newPath = resolve(newFileName);
    await rename(oldPath, newPath);
    console.log(`Successfully renamed "${oldFileName}" to "${newFileName}"`);
  } catch (err) {
    console.error(`Operation failed: ${err.message}`);
  }
}

const copyFile = async (paths) => {
  try {
    const [sourcePath, targetDir] = paths.trim().split(/\s+/)
    if (!sourcePath || !targetDir) {
      console.error('Invalid arguments: provide both source and destination');
    }
    
    const absSourcePath = resolve(sourcePath);
    const absTargetPath = resolve(targetDir, basename(sourcePath));
    
    const readStream = createReadStream(absSourcePath);
    const writeStream = createWriteStream(absTargetPath);
    
    await pipeline(readStream, writeStream);
    console.log(`File "${sourcePath}" successfully copied to "${absTargetPath}"`);
    
  } catch (err) {
    console.error(`Operation failed: ${err.message}`);
  }
}

const moveFile = async (paths) => {
  try {
    const [sourcePath, targetDir] = paths.trim().split(/\s+/)
    if (!sourcePath || !targetDir) {
      console.error('Invalid arguments: provide both source and destination');
    }
    const absSourcePath = resolve(sourcePath);
    const absDir = resolve(targetDir);
    const absTargetPath = resolve(targetDir, basename(sourcePath));

    await access(absSourcePath);
    await access(absDir);

    const readStream = createReadStream(absSourcePath);
    const writeStream = createWriteStream(absTargetPath);

    await pipeline(readStream, writeStream);
    await unlink(absSourcePath);

    console.log(`Success! ${absSourcePath} moved to: ${absTargetPath}`);

  } catch (err) {
    console.error(`Operation failed: ${err.message}`);
  }
}

export default handleFsCommands