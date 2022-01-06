const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

const filepath = './2021yoga.csv';

let urls = [];

const getUrls = async () => {
  fs.createReadStream(filepath)
    .on('error', () => {
      console.log('ERROR___');
    })
    .pipe(csvParser())
    .on('data', (row) => {
      const parsed_urls = row[''].split('\n').filter(line => line.startsWith('http'));
      parsed_urls.forEach(u => {
        if (u.length > 0) {
          urls.push(u);
        }
      })
    })
    .on('end', () => {
      console.log('finished extracting urls from source csv');
      // console.log(urls);
    })
}


// await getUrls();

(async () => {
  await getUrls();
  // await console.log(urls);
})();