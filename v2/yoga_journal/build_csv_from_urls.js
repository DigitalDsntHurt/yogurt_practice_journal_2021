const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const puppeteer = require('puppeteer');

const USERNAME_SELECTOR = "input[type='email']";
const PASSWORD_SELECTOR = "input[type='password']";
const CTA_SELECTOR = '.login-button';
const DURATION_SELECTOR = '.vjs-remaining-time-display';
const TITLE_SELECTOR = '.Headline-sc-1ymvv8q-0';
const INSTRUCTOR_SELECTOR = '.CoachList__CoachLink-sc-behfb2-0';
const loginUrl = 'https://www.alomoves.com/signin'
const credentials = require('./secrets');

async function login(page) {
  console.log('Logging in..')
  await page.goto(loginUrl);
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(credentials.username);
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(credentials.password);
  await page.click(CTA_SELECTOR);
  await page.waitForNavigation();
  console.log('..Logged in!')
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

async function processUrl(page, url) {
  await page.goto(url, {
    waitUntil: 'load',
  });
  console.log("========");
  console.log(`Page loaded : ${url}`);
  sleep(1000);
  const title = await page.evaluate(el => el.innerText, await page.$(TITLE_SELECTOR));
  const instructor = await page.evaluate(el => el.innerText, await page.$(INSTRUCTOR_SELECTOR));
  const duration = await page.evaluate(el => el.innerText, await page.$(DURATION_SELECTOR));
  // console.log(duration);
  // console.log(instructor);
  // console.log(title);
  // console.log("========");
  const durationSplit = duration.split(':')
  const mins = durationSplit.length === 3 ? Number(durationSplit[1]) + 60 : durationSplit[0]
  return { mins: mins, teacher: instructor, title: title, url: url }
}

async function scrape(urls) {
  const rows = [];
  const browser = await puppeteer.launch({
    // headless: false,
    headless: true,
    executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1366, height: 768 });
  await login(page);
  // urls.forEach(u => (await processUrl(page, u)))
  for (let i = 0; i < urls.length; i++) {
    rows.push(await processUrl(page, urls[i]));
  }
  await browser.close();
  return rows;
}

class CsvFile {
  static write(filestream, rows, options) {
    return new Promise((res, rej) => {
      csv.writeToStream(filestream, rows, options)
        .on('error', err => rej(err))
        .on('finish', () => res());
    });
  }

  constructor(opts) {
    this.headers = opts.headers;
    this.path = opts.path;
    this.writeOpts = { headers: this.headers, includeEndRowDelimiter: true };
  }

  create(rows) {
    return CsvFile.write(fs.createWriteStream(this.path), rows, { ...this.writeOpts });
  }

  append(rows) {
    return CsvFile.write(fs.createWriteStream(this.path, { flags: 'a' }), rows, {
      ...this.writeOpts,
      // dont write the headers when appending
      writeHeaders: false,
    });
  }

  read() {
    return new Promise((res, rej) => {
      fs.readFile(this.path, (err, contents) => {
        if (err) {
          return rej(err);
        }
        return res(contents);
      });
    });
  }
}

let cleanUrls = [];
const processRow = row => {
  cleanUrls.push(row[0])
};

const finish = async (targetfilepath) => {
  const csvFile = new CsvFile({
    path: targetfilepath,
    headers: ['mins', 'teacher', 'title', 'url'],
  });

  const rows = await scrape([...new Set(cleanUrls)]);

  csvFile
    .create(rows)
    .catch(err => {
      console.error(err.stack);
      process.exit(1);
    });
};


const processUrls = (sourcefilepath, targetfilepath) => {
  fs.createReadStream(sourcefilepath)
    .pipe(csv.parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', row => processRow(row))
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`))
    .on('end', () => finish(targetfilepath));
}

const sourcefilepath = path.resolve(__dirname, '2022_do_classes.csv');
// const targetfilepath = path.resolve(__dirname, '2021_alo_moves_yoga_classes_with_durations_and_meta.csv')
const targetfilepath = path.resolve(__dirname, 'tmptst.csv')
processUrls(sourcefilepath, targetfilepath);