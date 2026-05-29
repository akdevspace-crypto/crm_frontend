const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const targetUrl = 'https://b5tvsxt0-4000.inc1.devtunnels.ms';
const replacement = 'http://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:4000';

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    if (content.includes(targetUrl)) {
      content = content.split(targetUrl).join(replacement);
      changed = true;
    }
    if (content.includes('http://localhost:4000')) {
      content = content.split('http://localhost:4000').join(replacement);
      changed = true;
    }
    
    // Fix the socket.io initialization which might be in quotes instead of backticks
    if (content.includes(`io('${replacement}'`)) {
      content = content.split(`io('${replacement}'`).join(`io(\`${replacement}\``);
    }
    if (content.includes(`io("${replacement}"`)) {
      content = content.split(`io("${replacement}"`).join(`io(\`${replacement}\``);
    }

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log('Updated', filePath);
    }
  }
});
