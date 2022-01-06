const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const filepath = path.resolve(__dirname, 'unique_urls.csv');
fs.createReadStream(filepath)
  .pipe(csv.parse({ headers: false }))
  .on('error', error => console.error(error))
  .on('data', row => console.log(row))
  .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));



// const fs = require('fs');
// const csvParser = require('csv-parser');
// const filepath = './cleansed_urls.csv';

// let urls = [];

// const getUrls = async () => {
//   fs.createReadStream(filepath)
//     .on('error', () => {
//       console.log('ERROR___');
//     })
//     .pipe(csvParser())
//     .on('data', (row) => {
//       // const parsed_urls = row[''].split('\n').filter(line => line.startsWith('http'));
//       // parsed_urls.forEach(u => {
//       // if (u.length > 0) {
//       // urls.push(u);
//       // }
//       // })

//       // console.log(row);
//       urls.push(row);
//     })
//     .on('end', () => {
//       console.log('Finished!');
//       // console.log(urls);
//     })
// }


// // await getUrls();

// (async () => {
//   await getUrls();
//   await console.log(urls);
// })();