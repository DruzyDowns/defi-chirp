if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const axios = require("axios");
const Twit = require("twit");

const uniSubgraphUrl =
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";
const etherscanUrl = "https://api.etherscan.io/api";

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
    apikey: "PQSFTT516DI6TINDD52HFFU9VUQP993RGG",
  },
};

let cap = {
  url: "https://api.coingecko.com/api/v3/global",
  method: "GET",
  headers: { cookie: "__cfduid=d60a6fd95a521d1c221ffe46495411e9d1600228968" },
};

//prepare requests to send
const getEth = axios(eth);
const getGas = axios(gas);
const getCap = axios(cap);

//send all requests at once
axios
  .all([getEth, getGas, getCap])
  .then(
    axios.spread((...responses) => {
      tweetData = [];
      const ethPrice = responses[0].data.data.bundle.ethPrice;
      const gasPrice = responses[1].data.result.ProposeGasPrice;
      const marketCap = responses[2].data.data.market_cap_percentage;
      const btcDominance = marketCap.btc;

      // use/access the results
      tweetData.push(
        parseFloat(ethPrice).toFixed(2),
        parseInt(gasPrice).toString(),
        btcDominance.toFixed(2)
      );
      //console.log(tweetData);
      /*
      Tweet Data Key:
      [
      ETH price 0
      proposed gas 1
      BTC dominance 2
      ]
      */
      //compose the tweet
      const tweet = `
🦄  _DEX_ Live Update  🦄

_DEX_ Liquidity: ...
_DEX_ Volume: ...

$ETH: ${tweetData[0]}
Gas: ${tweetData[1]} gwei
BTC Mkt Cap: ${tweetData[2]}%

🦄  Live updates every hour | More bots in bio  🦄
`;

      console.log(tweet);
    })
  )
  .catch((errors) => {
    console.log(errors);
  });
