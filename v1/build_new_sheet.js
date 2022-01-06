const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const USERNAME_SELECTOR = "input[type='email']";
const PASSWORD_SELECTOR = "input[type='password']";
const CTA_SELECTOR = '.login-button';
const DURATION_SELECTOR = '.vjs-remaining-time-display';
const TITLE_SELECTOR = '.Headline-sc-1ymvv8q-0';
const INSTRUCTOR_SELECTOR = '.CoachList__CoachLink-sc-behfb2-0';
const loginUrl = 'https://www.alomoves.com/signin'
const credentials = require('../v2/secrets');

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

// async function processRow(row, page) {
//   const url = row[0];
//   console.log('processing row : ' + url);
//   await page.goto(url, {
//     waitUntil: 'load',
//   });
//   console.log("========");
//   // console.log(`Page loaded : ${url}`);
//   // sleep(1000);
//   // const title = await page.evaluate(el => el.innerText, await page.$(TITLE_SELECTOR));
//   // const instructor = await page.evaluate(el => el.innerText, await page.$(INSTRUCTOR_SELECTOR));
//   // const duration = await page.evaluate(el => el.innerText, await page.$(DURATION_SELECTOR));
//   // console.log(title);
//   // console.log(instructor);
//   // console.log(duration);
//   console.log("========");
// } // END processRow

async function getClassUrls() {
  const classUrls = [];
  const sourceCsvPath = path.resolve(__dirname, 'unique_urls.csv');
  console.log(`Loading rows from ${sourceCsvPath}`);
  fs.createReadStream(sourceCsvPath)
    .pipe(csv.parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', row => classUrls.push(row[0]))
    // .on('data', row => console.log(row[0]))
    .on('end', rowCount => {
      console.log('==== ====')
      console.log(`Parsed ${rowCount} rows from ${sourceCsvPath}`)
      console.log(`${classUrls.length}`)
      console.log('==== ====')
      return classUrls
    });
}
// async function loadCsvRows(page) {
//   const sourceCsvPath = path.resolve(__dirname, 'unique_urls.csv');
//   console.log(`Loading rows from ${sourceCsvPath}`);
//   fs.createReadStream(sourceCsvPath)
//     .pipe(csv.parse({ headers: false }))
//     .on('error', error => console.error(error))
//     .on('data', row => processRow(row, page))
//     // .on('data', row => console.log(row))
//     .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
// }

async function visitAllPages() {
  const browser = await puppeteer.launch({
    // headless: false,
    headless: true,
    executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1366, height: 768 });

  // await login(page);
  // await getClassUrls().then(console.log(classUrls.length));
  let payload;
  payload = await getClassUrls()
  // console.log(payload.length);



  // console.log(classUrls.length);
  // console.log(classUrls);
  // await loadCsvRows(page);
  // await processRow('https://www.alomoves.com/series/flow-state/workouts/11609', page);

  // await loadCsvRows();

  await browser.close();
}

(async () => {
  await visitAllPages();
  // process.exit(1);
})();

// loadCsvRows();



  // VISIT CLASS PAGES + COLLECT DURATIONS
  // await page.goto('https://www.alomoves.com/series/yoga-for-beginners/workouts/11459', {
  //   waitUntil: 'load',
  //   // timeout: 0,
  // });
  // console.log("========");
  // console.log("page loaded!");
  // await sleep(1000)
  // const duration = await page.evaluate(el => el.innerText, await page.$(DURATION_SELECTOR));
  // const instructor = await page.evaluate(el => el.innerText, await page.$(INSTRUCTOR_SELECTOR));
  // const title = await page.evaluate(el => el.innerText, await page.$(TITLE_SELECTOR));

  // console.log(duration);
  // console.log(instructor);
  // console.log(title);
  // console.log("========");


  // LOGIN
  // await page.goto(loginUrl);
  // await page.click(USERNAME_SELECTOR);
  // await page.keyboard.type(credentials.username);
  // await page.click(PASSWORD_SELECTOR);
  // await page.keyboard.type(credentials.password);
  // await page.click(CTA_SELECTOR);
  // await page.waitForNavigation();
  // console.log('Logged in!')