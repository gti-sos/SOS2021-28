const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    console.log("Browser opened.");

    const page = await browser.newPage();
    await page.goto('http://sos2021-28.herokuapp.com');
 
    console.log("Page opened! Taking an screenshot...");

    await page.screenshot({ path: './tests/screenshots/01.png' });
    
    const [response] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div:nth-child(15) > div:nth-child(1) > div > div.card-body > a:nth-child(3) > button"),
      ]);

      
      
    console.log("Clicked \"Award table\" link, waiting for contacts...");
      
    await page.waitForTimeout(1000);  

    console.log("Timeout! Taking an screenshot...");

    await page.screenshot({ path: './tests/screenshots/02.png' });
    await page.click("body > main > main > tr > td:nth-child(2) > button");
    await page.waitForTimeout(2000);
    var initialrowCount = (await page.$$("body > main > main > table > tbody > tr")).length;
    console.log(`Initial row count = ${initialrowCount}`);
    if(initialrowCount != 10){
        console.error("Initial row count is not 10")
        process.exit(1)
    }

    
    
    await page.$eval('body > main > main > table > tbody > tr:nth-child(1) > td:nth-child(1) > input', el => el.value = 'APrueba');
    await page.$eval('body > main > main > table > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=number]', el => el.value = '2021');
    await page.$eval('body > main > main > table > tbody > tr:nth-child(1) > td:nth-child(3) > input[type=number]', el => el.value = '2021');
    await page.$eval('body > main > main > table > tbody > tr:nth-child(1) > td:nth-child(4) > input', el => el.value = '2021');
    await page.$eval('body > main > main > table > tbody > tr:nth-child(1) > td:nth-child(5) > input[type=number]', el => el.value = '2021');
    await page.$eval('body > main > main > table > tbody > tr:nth-child(1) > td:nth-child(6) > input[type=number]', el => el.value = '2021');
    await page.screenshot({ path: './tests/screenshots/03.png' });
    await page.$eval('#add', el => el.click());
    
    await page.screenshot({ path: './tests/screenshots/04.png' });
    
    await page.waitForTimeout(2000);
    var pushrowCount = (await page.$$("body > main > main > table > tbody > tr")).length;

    console.log(`Push row count = ${pushrowCount}`);
    if(initialrowCount + 1  != pushrowCount){
        console.error("bad push")
        process.exit(1)
    }

    await page.waitForTimeout(2000);  

    
    
    await page.click("body > main > main > tr > td:nth-child(1) > button");
    await page.screenshot({ path: './tests/screenshots/05.png' });
    await page.waitForTimeout(2000);
    
    var finalrowCount = (await page.$$("body > main > main > table > tbody > tr")).length;

    console.log(`final row count = ${finalrowCount}`);
    if(2 != finalrowCount){
        console.error("not reset")
        process.exit(1)
    }
    await browser.close();

    console.log("Browser closed!");
    process.exit(0);

})();