import {cwd} from 'node:process';

const logDirChangedTo = () => {
  console.log(`You are currently in: ${cwd()}`)
}

export default logDirChangedTo