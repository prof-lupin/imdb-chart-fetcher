const cheerio = require('cheerio');
const fetch = require('node-fetch');

const args = process.argv.slice(2);

if(args.length != 2) {
    throw new Error("Invalid arguments set");
}

const chartUrl = args[0];
const count = Number(args[1]);

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

    const $ = cheerio.load(body);

    const titleList = $('td[class="titleColumn"] > a').map((i, x) => $(x).attr('href'));

    const urlList = titleList.slice(0,count).toArray().map(url => "https://www.imdb.com" + url);

    let imdbData = [];
    for(let i=0; i<urlList.length; i++) {
        let res = await fetch(urlList[i], {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9,hi-IN;q=0.8,hi;q=0.7",
            },
            gzip: true,
        });
        let stream = await res.text();

        let S = cheerio.load(stream);
        // _title_, _year_, _rating_, _summary_, _duration_, _genre_
        let title = S('div[class="title_wrapper"] > h1').text().trim();
        let rating = Number(S('div[class="ratingValue"] > strong > span').text());
        let summary = S('div[class="ipc-html-content ipc-html-content--base"] > div').text().trim(); // not working (TODO)
        let duration = S('div[class="subtext"] > time').text().trim();
        let genre = S('#titleStoryLine > div:nth-child(8) > a').text().trim();
        if(genre === "") {
            genre = S('#titleStoryLine > div:nth-child(10) > a').text().trim();
        }
        let year = Number(S('#titleYear > a').text());

        imdbData.push({
            title,
            year,
            rating,
            summary,
            duration,
            genre
        });
    }
    console.log(JSON.stringify(imdbData));
})();



