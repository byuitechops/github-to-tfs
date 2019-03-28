const puppeteer = require('puppeteer');

/* Eventually this will read in from cloneUrls.js or repos.csv instead of a hard coded URL */
var listOfRepos = ['https://github.com/byuitechops/test-repo.git'];
var allRepos = require('./cloneUrls.js');
console.log(allRepos);

/* Puppeteer function that clicks through the process of importing a repository from Github to TFS */
async function importRepo(cloneUrl) {
    const browser = await puppeteer.launch({
        slowMo: 200,
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://tfs.byui.edu/tfs/BYUIDefault/_git/Online%20Development');

    await page.waitForSelector('span.drop-icon.bowtie-icon')
    await page.evaluate(() => {
        document.querySelector('span.drop-icon.bowtie-icon').click();
    });

    await page.waitFor('div#vss_142');
    await page.evaluate(() => {
        document.querySelector('li#mi_149_import-repository').click();
    })

    await page.waitFor('div.import-repository-dialog');
    await page.type('input#TextField59', cloneUrl);

    await page.click('span.ms-Dialog-action.action_6ba344f5')
}

/* Calls importRepo for each repo in listOfRepos */
listOfRepos.forEach(repo => importRepo(repo));
