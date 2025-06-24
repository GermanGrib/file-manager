import {stat, readdir} from 'node:fs/promises'
import {dirname, isAbsolute, resolve, join} from 'node:path';
import {chdir, cwd} from 'node:process'
import logDirChangedTo from './utils/log-dir-change-to.mjs';


const handleNavCommands = async (command) => {
  let currentDir = cwd()
  switch (true) {
    case command === 'up':
      const parentDir = dirname(currentDir)
      if (parentDir !== currentDir) {
        currentDir = parentDir
        chdir(currentDir)
      }
      break
    
    case command.startsWith('cd '):
      const requestedPath = command.slice(3).trim()
      console.log(`Requested path ${requestedPath}`)
      try {
        const newPath = isAbsolute(requestedPath) ? requestedPath : resolve(currentDir, requestedPath)
        const stats = await stat(newPath)
        if (!stats.isDirectory()) {
          console.error('Operation failed: Not a directory');
        }
        process.chdir(newPath);
        
      } catch (e) {
        console.error('Operation failed: Path does not exist')
      }
      break
    
    case command === 'ls':
      try {
        const currDir = cwd()
        const allFiles = await readdir(currDir)
        
        const filesReport = await Promise.all(
          allFiles.map(async (name) => {
            const fullPath = join(currDir, name)
            const stats = await stat(fullPath)
            
            return {
              name,
              type: stats.isDirectory() ? 'directory' : 'file',
            }
          })
        )
        
        const sortedData = filesReport.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1
          }
          return a.name.localeCompare(b.name)
        })
        
        console.table(sortedData, ['name', 'type'])
        
      } catch (e) {
        console.error(e)
      }
      
      break
  }
}

export default handleNavCommands;