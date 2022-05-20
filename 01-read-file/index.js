const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(src, 'utf-8');

let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));
stream.on('error', (er) => console.log('Error', er.message));