const fs = require('fs');
const path = require('path');
const srcPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');
fs.mkdir(copyPath, err => err);
const { readdir } = require('fs/promises');

async function removeFiles() {
  try {
    const files = await readdir(copyPath, { withFileTypes: true });
    files.forEach(file => {
      fs.unlink(path.join(copyPath, file.name), err => {
        if (err) {
          console.log(err.message);
        }
      });
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function addFiles() {
  try {
    const files = await readdir(srcPath, { withFileTypes: true });
    files.forEach(it => {
      if(it.isFile()){
        let wayFrom = path.join(srcPath, it.name);
        let wayTo = path.join(copyPath, it.name);
        fs.copyFile(wayFrom, wayTo, err => {
          if (err) {
            console.log(err.message);
          }
        });
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}


function opyDir() {
  removeFiles();
  addFiles();
}

opyDir();
