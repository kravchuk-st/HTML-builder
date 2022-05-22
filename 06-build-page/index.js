const fs = require('fs');
const path = require('path');
const distPath = path.join(__dirname, 'project-dist');
const htmlPath = path.join(__dirname, 'project-dist', 'index.html');
const htmlComponentsPath = path.join(__dirname, 'components');
const cssPath = path.join(__dirname, 'project-dist', 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const assetsOutPath = path.join(distPath, 'assets');
const resCss = fs.createWriteStream(cssPath);
const { readdir } = require('fs/promises');

fs.mkdir(distPath, {recursive:true}, err => err);
fs.rm(assetsOutPath, {recursive:true}, err => err);

async function writeHtml() {
  fs.readFile(path.join(__dirname, 'template.html'), {encoding: 'utf-8'}, (err, data) => {
    if (err) console.log(err.message);
    (async () => {
      const files = await readdir(htmlComponentsPath, { withFileTypes: true });
      files.forEach(file => {
        if (file.isFile() && path.extname(file.name) === '.html') {
          let fileName = file.name.split('.')[0];
          let stream = fs.createReadStream(path.join(htmlComponentsPath, file.name));
          let part = '';
          stream.on('data', chunk => part += chunk);
          stream.on('end', () => {
            if (fileName) {
              data = data.replace(`{{${fileName}}}`, part);
            }
            let res = fs.createWriteStream(htmlPath);
            res.write(data);
          });
        }
      });
    })();
  });
}

async function writeStyles() {
  try {
    const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    files.forEach(it => {
      if(it.isFile() && path.extname(it.name) === '.css'){
        let wayFrom = path.join(__dirname, 'styles', it.name);
        const stream = fs.createReadStream(wayFrom, 'utf-8');
        let styles = '';
        stream.on('data', chunk => styles += chunk);
        stream.on('end', () => {
          resCss.write(`${styles}\n`);
        });
        stream.on('error', (er) => console.log(er.message));
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function copyAssets(wayFrom, wayTo) {
  try {
    let files = await readdir(wayFrom, { withFileTypes: true });
    files.forEach(it => {
      if(it.isFile()){
        fs.mkdir(wayTo, {recursive:true}, err=>err);
        fs.copyFile(path.join(wayFrom, it.name), path.join(wayTo, it.name), err => {
          if (err) {
            console.log(err.message);
          }
        });
      } else {
        fs.mkdir(path.join(assetsOutPath, it.name), {recursive:true}, err=>err);
        copyAssets(path.join(wayFrom, it.name), path.join(wayTo, it.name));
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}

writeHtml();
writeStyles();
copyAssets(assetsPath, assetsOutPath);
