import puppeteer from 'puppeteer';
import fs from 'fs';
import 'dotenv/config'

const LOGIN = process.env.LOGIN;
const PASSWORD = process.env.PASSWORD;
const USER_NAME = proce.env.USER_NAME;

async function scrollDown(selector, page) {
    await page.evaluate(async selector => {
        const section = document.querySelector('._aano');
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 100;
            const timer = setInterval(() => {
                var scrollHeight = section.scrollHeight;
                section.scrollTop = 100000000;
                totalHeight += distance;

                if (totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    }, selector);
}

function writeFile(data) {
    const date = new Date()
    fs.writeFileSync(`${date.toJSON()}.txt`, JSON.stringify(data, null, 2), (err)=> {
        if(err) throw err;
        return 'Arquivo criado'
    })
}

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://www.instagram.com/accounts/login/');

    await page.waitForSelector('input[name=username]')
    await page.type('input[name="username"]', LOGIN);
    await page.type('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForNavigation();
    await page.goto(`https://www.instagram.com/${USER_NAME}/followers/`);

    await page.waitForSelector('._aano');
    await scrollDown('._aano', page);

    //se não chegar nada precisa mudar a classe ._aaco
    let followerRaw = await page.$$eval("._aaco", namesFollowers => namesFollowers.map(link => link.innerText))
    writeFile(followerRaw)

    await browser.close();
})();
