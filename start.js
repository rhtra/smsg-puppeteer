const puppeteer = require('puppeteer');
const dateFormat = require('dateformat');
const email = process.argv[2];
const pass = process.argv[3];

async function startBrowser() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return {browser, page};
}

async function closeBrowser(browser) {
  return browser.close();
}

async function playTest(url) {
  const {browser, page} = await startBrowser();
  
  await page.goto(url, {"waitUntil" : "networkidle0", timeout: 0});
  await page.screenshot({path: 'screenshots/1-login.png'});
  await page.waitFor('input[name=email]');
  await page.type('input[name=email]', email);
  await page.waitFor('input[name=password]');
  await page.type('input[name=password]', pass);
  await page.screenshot({path: 'screenshots/2-login-credentials.png', fullPage: true});
  await Promise.all([
      page.click("button[type=submit]"),
      page.waitForNavigation({ waitUntil: 'networkidle0' })	  
  ]);
 
  await page.screenshot({path: 'screenshots/3-after-login.png'});
  
  let current_url = page.url().split('/');
  current_url[2] = 'dev2.shopmessage.me';
  let token = current_url[3];
  current_url.pop();
  current_url[4] = 'dashboard';
  let next_url = current_url.join('/');
  
  await page.goto(next_url, {"waitUntil" : "networkidle0", timeout: 0});  
  await page.screenshot({path: 'screenshots/4-dashboard.png', fullPage: true})
  
  let linkHandlers = await page.$x("//span[contains(text(), 'Growth Plugins')]");
  
  await Promise.all([
      await linkHandlers[0].click(),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 })	  
  ]);
  //await page.waitForXPath("//span[contains(text(), 'Create')]");
  //await page.waitForSelector('.highcharts-container', {visible: true});
  //await page.click("");
  
  await page.waitFor(4000);
  await page.screenshot({path: 'screenshots/5-growth plugin.png', fullPage: true});
  
  linkHandlers = await page.$x("//span[contains(text(), 'Create')]");
  
  await Promise.all([
      await linkHandlers[0].click(),	
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 })	  
  ]);
  
  await page.screenshot({path: 'screenshots/6-create growth plugin.png', fullPage: true});
  
  linkHandlers = await page.$x("//strong[contains(text(), 'Modal')]");
  
  await Promise.all([
    await linkHandlers[0].click(),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 }),
	await page.waitFor(5000)
  ]);
  await page.screenshot({path: 'screenshots/7-create modal.png', fullPage: true});
  
  page.evaluate(() => {
    let images = document.querySelectorAll('img');
    images.forEach(image => {        
		if(image.getAttribute('src').indexOf('fredoka')) 
			image.click()
       
    })
  })
  await page.waitFor('input[id=name]');
  await page.type('input[id=name]', ' ' + dateFormat(new Date(), "yyyy-mm-dd - hh:MM:ss"));
  
  await page.screenshot({path: 'screenshots/8-create preset modal.png', fullPage: true});
  await page.waitFor(2000)
  /*linkHandlers = await page.$x("//span[contains(text(), 'Create')]");
  
  await Promise.all([
      await linkHandlers[0].click(),	
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 }),
	  await page.waitFor(5000)
  ]);*/

  page.evaluate(() => {
    let span = Array.from(document.querySelectorAll('span')).find(el => el.textContent === 'Create')
    span.click();
  })
  
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 })	  
  await page.waitFor(5000);
  await page.screenshot({path: 'screenshots/9-plugin page.png', fullPage: true});
  
  page.evaluate(() => {
	let dropdown = document.querySelectorAll('.ant-select-selection-selected-value');
	dropdown[1].click();
	let options = document.querySelectorAll('.ant-select-dropdown-menu-item');
	options[0].click();
  })
  
  await page.screenshot({path: 'screenshots/10-change button color.png', fullPage: true});
  
  page.evaluate(() => {
	Array.from(document.querySelectorAll('div')).find(el => el.textContent === 'Behavior').click();
  })
  
  await page.screenshot({path: 'screenshots/11-behavior.png',fullPage: true})
  
  page.evaluate(() => {
	let dropdown = document.querySelectorAll('.ant-dropdown-trigger');
	dropdown[0].click();
	let options = document.querySelectorAll('.ant-dropdown-menu-item');
	options[2].click();
  })
  
  await page.waitFor(5000);
  
  await page.screenshot({path: 'screenshots/12-behavior selected.png', fullPage: true})
  
  page.evaluate(() => {
	let button = document.querySelectorAll('.ant-btn-primary');
	button[1].click();
  })
  
  await page.waitFor(5000);
  
  page.evaluate(() => {
	let button = document.querySelectorAll('.ant-btn-primary');
	button[1].click();
  })
  
  await page.screenshot({path: 'screenshots/13-move to publish.png', fullPage: true})
  
  page.evaluate(() => {
	let button = document.querySelectorAll('.ant-btn-primary');
	button[1].click();
  })
  
  
  await page.screenshot({path: 'screenshots/14-publish confirmation.png', fullPage: true})
  
  page.evaluate(() => {
	let button = document.querySelectorAll('.ant-btn-primary');
	button[2].click();
  })
  
   await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 })
   
   await page.screenshot({path: 'screenshots/15-modal created.png', fullPage: true})
   
   page.evaluate(() => {
	let toggle = document.querySelectorAll('.ant-switch');
	toggle[0].click();
  })
  
  await page.screenshot({path: 'screenshots/16-modal toggle.png', fullPage: true})

 }

(async () => {
  await playTest("https://dev2.shopmessage.me/shopmessage/login");
  process.exit(1);
})();