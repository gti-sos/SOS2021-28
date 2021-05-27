const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    console.log("Browser opened.");

    const page = await browser.newPage();
    await page.goto('http://sos2021-28.herokuapp.com');
 
    console.log("Page opened! Taking an screenshot...");

    await page.screenshot({ path: './tests/screenshots/platforms/01-InicioHeroku.png' });//Foto de la imagen inicial

    /////////

    

    

    
    
    const [response] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div:nth-child(15) > div:nth-child(2) > div > div.card-body > a:nth-child(3) > button"),
      ]);
     
    //Cargar para las capturas -> Postman hace al final un ../delete/plaforms
    await page.click("body > main > main > ul > li:nth-child(3) > a");
    await page.waitForTimeout(3000);
    await page.click("body > main > main > ul > li:nth-child(3) > div > div.modal.show.d-block > div > div > div.modal-footer > button.btn.btn-primary");
    await page.waitForTimeout(3000);
   //
    console.log("Clicked \"Platforms table\" link, waiting for contacts...");  
    await page.waitForTimeout(1000);  
    console.log("Timeout! Taking an screenshot...");
    await page.screenshot({ path: './tests/screenshots/platforms/02-TablaCargada.png' });//Foto de tabla de plataformas
    
    /////////////
/*
    await page.waitForTimeout(3000);
    await page.click("body > main > main > table:nth-child(7) > tbody");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: './tests/screenshots/platforms/Tabla.png' }); //Tabla
*/
    await page.waitForTimeout(2000);
    var initialrowCount = (await page.$$("body > main > main > table:nth-child(9) > tbody > tr")).length;
    await page.waitForTimeout(2000);

    

    console.log(`Initial row count = ${initialrowCount}`);
    if(initialrowCount != 9){
        console.error("Initial row count is not 8")
        //process.exit(1)
    }
    await page.waitForTimeout(2000);
    
    
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(1) > input[type=text]', el => el.value = 'PlatformPrueba');
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=text]', el => el.value = 'PlatformPrueba');
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(3) > input[type=number]', el => el.value = '2021');
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(4) > input[type=number]', el => el.value = '199999');
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(5) > input[type=number]', el => el.value = '8');
   
    await page.screenshot({ path: './tests/screenshots/platforms/03-Insertar.png' });
    await page.$eval('body > main > main > table:nth-child(8) > tbody > tr:nth-child(1) > td:nth-child(6) > button', el => el.click()); //Insertar dato
    await page.waitForTimeout(2000);
    
    await page.click("body > main > main > ul > li:nth-child(4) > a");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: './tests/screenshots/platforms/04-Borrar.png' }); //borrar todo

    await page.waitForTimeout(3000);
    ///////////////////////////


    //Cancelar
    await page.click("body > main > main > ul > li:nth-child(4) > div > div.modal.show.d-block > div > div > div.modal-footer > button.btn.btn-secondary");
    //
    await page.waitForTimeout(3000);
    await page.click("body > main > main > ul > li:nth-child(3) > a");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: './tests/screenshots/platforms/05.png' }); //cargar todo
    await page.waitForTimeout(3000);
    //Cancelar
    await page.click("body > main > main > ul > li:nth-child(3) > div > div.modal.show.d-block > div > div > div.modal-footer > button.btn.btn-secondary");
    //

    var finalrowCount = (await page.$$("body > main > main > table:nth-child(7) > tbody > tr:nth-child(1)")).length;

    console.log(`final row count = ${finalrowCount}`);
    if(0 != finalrowCount){
        console.error("not reset")
        process.exit(1)
    }


    //Borar todo para dejarlo bien
    await page.waitForTimeout(3000);
    await page.click("body > main > main > ul > li:nth-child(4) > a");
    await page.waitForTimeout(3000);
    await page.click("body > main > main > ul > li:nth-child(4) > div > div.modal.show.d-block > div > div > div.modal-footer > button.btn.btn-danger");
    await page.waitForTimeout(3000);
    //    
    await browser.close();

    console.log("Browser closed!");
    process.exit(0);

})();