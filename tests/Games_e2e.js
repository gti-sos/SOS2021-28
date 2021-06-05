const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    console.log("Browser opened.");

    const page = await browser.newPage();
    await page.goto('http://sos2021-28.herokuapp.com');
 
    console.log("Page opened! Taking an screenshot...");

    await page.screenshot({ path: './tests/screenshots/games/01-inicio.png' });
    
    const [response] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div:nth-child(15) > div:nth-child(3) > div > div.card-body > a:nth-child(3) > button"),
      ]);
    console.log("Clicked \"Game table\" link, waiting for contacts...");
      
    await page.waitForTimeout(1000);  

    console.log("Timeout! Taking an screenshot...");

    await page.screenshot({ path: './tests/screenshots/games/02-tabla.png' });
    //await page.click("body > main > main > ul > li:nth-child(3) > a");

    /*
    await page.waitForTimeout(3000);
    await page.click("body > main > main > ul > li:nth-child(3) > a");
    await page.waitForTimeout(3000);
    await page.click("body > main > main > ul > li:nth-child(3) > div > div.modal.show.d-block > div > div > div.modal-footer > button.btn.btn-primary");
    await page.waitForTimeout(3000);
*/
    
    await page.waitForTimeout(2000);
    var initialrowCount = (await page.$$("body > main > main > table:nth-child(8) > tbody > tr:nth-child(1)")).length;
    await page.waitForTimeout(2000);
    console.log(`Initial row count = ${initialrowCount}`);
    if(initialrowCount != 9){
        console.error("Initial row count is not 8")
        //process.exit(1)
    }
    await page.waitForTimeout(2000);
    
    
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(1) > input', el => el.value = 'GPrueba');
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(2) > input', el => el.value = 'GPrueba');
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(3) > input[type=number]', el => el.value = '2021');
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(4) > input[type=number]', el => el.value = '2021');
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(5) > input', el => el.value = 'GPrueba');

    await page.screenshot({ path: './tests/screenshots/games/03-insertarDato.png' });
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(6) > button', el => el.click());
    await page.waitForTimeout(2000);

    await page.click("body > main > main > ul > li:nth-child(4) > a");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: './tests/screenshots/games/04-borrarDatos.png' });

    await page.waitForTimeout(3000);
    /*
    var pushrowCount = (await page.$$("body > main > main > table:nth-child(8) > tbody > tr:nth-child(1)")).length;

    console.log(`Push row count = ${pushrowCount}`);
    if(initialrowCount + 1  != pushrowCount){
        console.error("bad push")
        process.exit(1)
    }

    await page.waitForTimeout(2000);  
*/
    //Cancelar
    await page.click("body > main > main > ul > li:nth-child(4) > div > div.modal.show.d-block > div > div > div.modal-footer > button.btn.btn-secondary");
    //
    await page.waitForTimeout(3000);
    await page.click("body > main > main > ul > li:nth-child(3) > a");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: './tests/screenshots/games/05-cargaDatos.png' }); //cargar todo
    await page.waitForTimeout(3000);
    //Cancelar
    await page.click("body > main > main > ul > li:nth-child(3) > div > div.modal.show.d-block > div > div > div.modal-footer > button.btn.btn-secondary");
    //
    
    /*
    await page.click("body > main > main > ul > li:nth-child(4) > a");
    await page.screenshot({ path: './tests/screenshots/games/05.png' });
    await page.waitForTimeout(2000);
    */
    var finalrowCount = (await page.$$("body > main > main > table:nth-child(7) > tbody > tr:nth-child(1)")).length;

    console.log(`final row count = ${finalrowCount}`);
    if(1 != finalrowCount){
        console.error("not reset")
        process.exit(1)
    }

    //Borrar todo para dejarlo bien
    await page.waitForTimeout(3000);
    await page.click("body > main > main > ul > li:nth-child(4) > a");
    await page.waitForTimeout(3000);
    await page.click("body > main > main > ul > li:nth-child(4) > div > div.modal.show.d-block > div > div > div.modal-footer > button.btn.btn-danger");
    await page.waitForTimeout(3000);
    //
    await page.click("body > main > main > ul > li:nth-child(3) > a");
    await page.waitForTimeout(3000);
    await page.click("body > main > main > ul > li:nth-child(3) > div > div.modal.show.d-block > div > div > div.modal-footer > button.btn.btn-primary");
    await page.waitForTimeout(3000);

    await browser.close();

    console.log("Browser closed!");
    process.exit(0);

})();