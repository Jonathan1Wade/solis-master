const dotenv = require("dotenv");
const axios = require("axios").default;
dotenv.config();

const SolisInverterClient = require("./lib/solis_inverter_client.js");

const { name } = require("./package.json");

let interval = parseInt(process.env.INTERVAL);
if (isNaN(interval) || interval < 30) {
  interval = 30;
}

const port = 8000;
const address = process.env.SOLIS_ADDRESS;
const username = process.env.SOLIS_USERNAME;
const password = process.env.SOLIS_PASSWORD;

if (!address) {
  console.error("address not given");
  process.exit(1);
}

if (!port) {
  console.error("port not given");
  process.exit(1);
}

const inverter = new SolisInverterClient(address, username, password);

/**
 * @type {Object|null}
 */
let lastResponse = null;

/**
 * @type {Date|null}
 */
let lastDate = new Date();

/**
 * @param what
 */
const log = (what) =>
  console.log([new Date().toISOString(), name, what].join(" "));

const server = require("http").createServer((req, res) => {
  if (lastResponse) {
    res.writeHead(200, { "Last-Modified": lastDate.toString() });
    res.end(JSON.stringify(lastResponse));
  } else {
    res.writeHead(500);
    res.end("No data");
  }
});

/**
 * @return {Promise}
 */
const fetchData = () =>
  inverter
    .fetchData()
    .then((data) => {
      if (
        data.inverter.serial &&
        data.inverter.firmwareMain &&
        data.inverter.firmwareSlave
      ) {
        // only store valid responses
        lastResponse = data;
        lastDate.setTime(Date.now());

        console.log(`Received data: ${lastResponse.power}`);

        if (process.env.EMON_SEND_DATA === "true") {
          axios
            .get(`${process.env.EMON_URL}/input/post`, {
              params: {
                node: process.env.EMON_NODE,
                fulljson: {
                  power: lastResponse.power,
                  time: Date.now(),
                },
              },
              headers: {
                Authorization: "Bearer " + process.env.EMON_WRITE_KEY,
              },
            })
            .then(function (response) {
              console.log("data sent");
            })
            .catch(function (error) {
              console.log("error sending data");
            })
            .then(function () {
              // always executed
            });
        }
        if (process.env.EMON_SEND_DATA === "true") {
          axios
            .get(`${process.env.EMON_URL}/input/post`, {
              params: {
                node: process.env.EMON_NODE1,
                fulljson: {
                  power1: lastResponse.power,
                  time1: Date.now(),
                },
              },
              headers: {
                Authorization: "Bearer " + process.env.EMON_WRITE_KEY,
              },
            })
            .then(function (response) {
              console.log("data sent");
            })
            .catch(function (error) {
              console.log("error sending data");
            })
            .then(function () {
              // always executed
            });
        }




      }
    })
    .catch((err) => log(`Could not fetch data from inverter: ${err}`));

server.listen(port, (err) => {
  if (err) {
    log(`unable to listen on port ${port}: ${err}`);
  } else {
    log(`listening on port ${port}`);
    fetchData().then(() => setInterval(fetchData, interval * 1000));
  }
});
