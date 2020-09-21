if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const axios = require("axios");
const Twit = require("twit");

const uniSubgraphUrl =
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";
const etherscanUrl = "https://api.etherscan.io/api";

//set up twit to post staus update for user
const chirp = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.UNISWAP_TOKEN,
  access_token_secret: process.env.UNISWAP_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

//define individual axios requests
let eth = {
  url: uniSubgraphUrl,
  method: "post",
  data: {
    query: `
    { bundle(id: "1" ) {
      ethPrice
      }
    }
    `,
  },
};

let gas = {
  url: etherscanUrl,
  method: "GET",
  params: {
    module: "gastracker",
    action: "gasoracle",
    apikey: process.env.ETHERSCAN_API_KEY,
  },
};

let cap = {
  url: "https://api.coingecko.com/api/v3/global",
  method: "GET",
  headers: { cookie: "__cfduid=d60a6fd95a521d1c221ffe46495411e9d1600228968" },
};

const now = Math.floor(Date.now() / 1000);
const dayStart = Math.floor(now / 86400);

let dayData = {
  url: uniSubgraphUrl,
  method: "post",
  data: {
    query: `
    {
     uniswapDayData( id: "${dayStart}"){
       dailyVolumeUSD
       totalLiquidityUSD
     }
    }
    `,
  },
};

//prepare requests to send
const getEth = axios(eth);
const getGas = axios(gas);
const getCap = axios(cap);
const getDayData = axios(dayData);

//send all requests at once
axios
  .all([getEth, getGas, getCap, getDayData])
  .then(
    axios.spread((...responses) => {
      tweetData = [];
      const ethPrice = responses[0].data.data.bundle.ethPrice;
      const gasPrice = responses[1].data.result.ProposeGasPrice;
      const marketCap = responses[2].data.data.market_cap_percentage;
      const btcDominance = marketCap.btc;
      const uniswapDayData = responses[3].data.data.uniswapDayData;

      // use/access the results
      tweetData.push(
        parseFloat(ethPrice).toFixed(2),
        parseInt(gasPrice).toString(),
        btcDominance.toFixed(2),
        parseFloat(uniswapDayData.totalLiquidityUSD)
          .toLocaleString()
          .split(".")[0],
        parseFloat(uniswapDayData.dailyVolumeUSD).toLocaleString().split(".")[0]
      );
      //console.log(tweetData);

      /*
      Tweet Data Key:
      [
      ETH price 0
      proposed gas 1
      BTC dominance 2
      Uniswap liquidity 3
      Uniswap daily volume 4
      ]
      */
      //compose the tweet
      const tweet = `
🦄  #Uniswap Live Update  🦄

Total Liquidity: ${tweetData[3]} $USD
Current Daily Volume: ${tweetData[4]} $USD

$ETH: ${tweetData[0]}
Gas: ${tweetData[1]} gwei
$BTC Dominance: ${tweetData[2]}%

🦄  Live updates every hour | More bots in bio  🦄
`;

      //console.log(tweet);

      chirp.post(
        "statuses/update",
        {
          status: tweet,
        },
        function (err, data, response) {
          console.log(err);
          console.log(data);
        }
      );
    })
  )
  .catch((errors) => {
    console.log(errors);
  });
