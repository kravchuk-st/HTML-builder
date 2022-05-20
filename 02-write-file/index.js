const fs = require('fs');
const path = require('path');
const outPut = path.join(__dirname, 'text.txt');
const { stdin, stdout, exit } = process;
const stream = fs.createWriteStream(outPut);

stdout.write('Write a some text:\n');
stdin.on('data', (data) => {
  let str = data.toString();
  if (str.trim().toLowerCase() === 'exit') {
    exit();
  } else {
    stream.write(str);
  }
});

process.on('SIGINT', () => exit());
process.on('exit', () => {
  stdout.write('See you later!');
});