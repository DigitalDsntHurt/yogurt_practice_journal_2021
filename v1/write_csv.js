const fs = require('fs');

const write_path = './2021_yogurt_classes.csv'
fs.writeFile(
  write_path,
  'hi, bye, salutes\ngimme, want, desires',
  (err) => {
    if (err) throw err;
  }
);