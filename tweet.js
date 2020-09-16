if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Twit = require("twit");

const chirp = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.TOKEN,
  access_token_secret: process.env.TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

chirp.post(
  "statuses/update",
  {
    status:
      "Hello World. This is a test tweet using a script I wrote in NodeJS",
  },
  function (err, data, response) {
    console.log(err);
    console.log(data);
  }
);
