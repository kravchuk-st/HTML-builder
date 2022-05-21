const fs = require('fs');
const path = require('path');
const srcPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist', 'bundle.css');
const res = fs.createWriteStream(destPath);
const { readdir } = require('fs/promises');

async function writeFiles() {
  try {
    const files = await readdir(srcPath, { withFileTypes: true });
    files.forEach(it => {
      if(it.isFile() && path.extname(it.name) === '.css'){
        let wayFrom = path.join(__dirname, 'styles', it.name);
        const stream = fs.createReadStream(wayFrom, 'utf-8');
        let styles = '';
        stream.on('data', chunk => styles += chunk);
        stream.on('end', () => {
          res.write(`${styles}\n`);
        });
        stream.on('error', (er) => console.log('Error', er.message));
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}

writeFiles();