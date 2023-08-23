import git from 'simple-git';
import express from 'express';
import { spawn } from 'child_process';

async function updateAndRunServer() {
  // Update the Git repository
  console.log('Pulling latest changes from remote repository...');
  const g = await git();
  await g.pull();

  // Run the web server project
  const serverProcess = spawn('nx', [
    'run-many',
    '--target=serve',
    '--projects=op,websocket,chat',
    '--parallel=6',
  ]); // Change this if your start command is different

  serverProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
}

// Run the updateAndRunServer function
updateAndRunServer().catch((error) => {
  console.error('An error occurred:', error);
});
