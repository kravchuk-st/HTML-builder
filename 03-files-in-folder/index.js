const fs = require('fs');
const path = require('path');
const pathFolder = path.join(__dirname, 'secret-folder');
const { readdir } = require('fs/promises');

async function serchFile (way) {
  try {
    const files = await readdir(way, {withFileTypes: true});
    files.forEach((it) => {
      if (it.isFile()) {
        let fileName = it.name.split('.');
        let pathFile = path.join(__dirname, 'secret-folder', it.name);
        fs.stat(pathFile, true, (err, data) => {
          if (err) {
            return console.log(err.message);
          }
          return console.log(`${fileName[0]} - ${fileName[1]} - ${data.size / 1024}kb`);
        });
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}

serchFile(pathFolder);