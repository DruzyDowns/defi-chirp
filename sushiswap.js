if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const puppeteer = require("puppeteer");
const fs = require("fs");
const Twit = require("twit");

(async () => {
  try {
    // open the headless browser
    var browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    // open a new page
    var page = await browser.newPage();
    // enter url in page
    await page.goto(`https://sushiswap.vision/home`);

    //Select the elements of the page to scrape
    await page.waitForSelector("div.sc-bdVaJa");

    var scrape = await page.evaluate(() => {
      let volume = document.querySelector(
        "#center > div > div.sc-hMqMXs.kVlxJn > div > div.css-1khkonh > div > div > div > div:nth-child(1) > div.sc-ifAKCX.sc-bZQynM.sc-gzVnrw.hatkAI > div.sc-bdVaJa.jofVNV.css-1y6yero"
      ).innerHTML;

      let volumePercentage = document.querySelector(
        "#center > div > div.sc-hMqMXs.kVlxJn > div > div.css-1khkonh > div > div > div > div:nth-child(1) > div.sc-ifAKCX.sc-bZQynM.sc-gzVnrw.hatkAI > div.sc-bdVaJa.jofVNV.css-e5f8z7 > div"
      ).innerHTML;

      let liquidity = document.querySelector(
        "#center > div > div.sc-hMqMXs.kVlxJn > div > div.css-1khkonh > div > div > div > div:nth-child(2) > div.sc-ifAKCX.sc-bZQynM.sc-gzVnrw.hatkAI > div.sc-bdVaJa.jofVNV.css-1y6yero"
      ).innerHTML;

      let liquidityPercentage = document.querySelector(
        "#center > div > div.sc-hMqMXs.kVlxJn > div > div.css-1khkonh > div > div > div > div:nth-child(2) > div.sc-ifAKCX.sc-bZQynM.sc-gzVnrw.hatkAI > div.sc-bdVaJa.jofVNV.css-e5f8z7 > div"
      ).innerHTML;

      return `Current Liquidity: ${liquidity} (${liquidityPercentage})
Volume (24hrs): ${volume} (${volumePercentage})`;
    });

    await browser.close();

    // Use Twit to post the tweet

    const chirp = new Twit({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token: process.env.SUSHISWAP_TOKEN,
      access_token_secret: process.env.SUSHISWAP_TOKEN_SECRET,
      timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
      strictSSL: true, // optional - requires SSL certificates to be valid.
    });

    chirp.post(
      "statuses/update",
      {
        status: `🍣 Live #SushiSwap updates hourly 🍣

${scrape}

🍣 More bots in bio! 🍣`,
      },
      function (err, data, response) {
        console.log(err);
        console.log(data);
      }
    );
  } catch (err) {
    // Catch and display errors
    console.log(err);
    await browser.close();
  }
})();
