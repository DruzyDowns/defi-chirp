var axios = require("axios").default;

var options = {
  method: "GET",
  url: "https://api.etherscan.io/api",
  params: {
    module: "gastracker",
    action: "gasoracle",
    apikey: "PQSFTT516DI6TINDD52HFFU9VUQP993RGG",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
