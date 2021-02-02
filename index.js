const cheerio = require('cheerio');
// const fs = require('fs');
const fetch = require('node-fetch');

const args = process.argv.slice(2);

if(args.length != 2) {
    throw new Error("Invalid arguments set");
}

const chartUrl = args[0];
const count = Number(args[1]);
// let body = null;

// console.log(chartUrl+ " " + count);

(async () => {
    const response = await fetch(chartUrl, {
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi-IN;q=0.8,hi;q=0.7",
        },
        gzip: true,
    });
    const body = await response.text();

    let $ = cheerio.load(body);

    let titleList = $('td[class="titleColumn"] > a').map((i, x) => $(x).attr('href'));
    // console.log(titleList.slice(0,count).toArray());

    // console.log(body);
    // return body;
})();



