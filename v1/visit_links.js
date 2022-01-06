// const path = require('path/posix');
const puppeteer = require('puppeteer');

const USERNAME_SELECTOR = "input[type='email']";
const PASSWORD_SELECTOR = "input[type='password']";
const CTA_SELECTOR = '.login-button';
const DURATION_SELECTOR = '.vjs-remaining-time-display';
const TITLE_SELECTOR = '.Headline-sc-1ymvv8q-0';
const INSTRUCTOR_SELECTOR = '.CoachList__CoachLink-sc-behfb2-0';
const loginUrl = 'https://www.alomoves.com/signin'
const credentials = require('../v2/secrets');

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

async function visitAllPages() {
  // SETUP BROWSER
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1366, height: 768 });

  // LOGIN
  await page.goto(loginUrl);
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(credentials.username);
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(credentials.password);
  await page.click(CTA_SELECTOR);
  await page.waitForNavigation();
  // await page.screenshot({ path: 'logedinscreen.png' });
  console.log('Logged in!')

  // VISIT CLASS PAGES + COLLECT DURATIONS
  await page.goto('https://www.alomoves.com/series/yoga-for-beginners/workouts/11459', {
    waitUntil: 'load',
    // timeout: 0,
  });
  console.log("========");
  // await page.screenshot({ path: 'class_screen.png' })
  console.log("page loaded!");
  await sleep(1000)
  const duration = await page.evaluate(el => el.innerText, await page.$(DURATION_SELECTOR));
  const instructor = await page.evaluate(el => el.innerText, await page.$(INSTRUCTOR_SELECTOR));
  const title = await page.evaluate(el => el.innerText, await page.$(TITLE_SELECTOR));

  console.log(duration);
  console.log(instructor);
  console.log(title);
  console.log("========");

  await browser.close();
}

(async () => {
  await visitAllPages();
  process.exit(1);
})();
