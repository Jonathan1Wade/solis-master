# Solis inverter JSON API

A simple NodeJS application to read Solis PV inverter data using HTTP interface, extract and serve data as JSON, then send power data to emoncms energy monitoring system.

CREDIT - this is just a bit of extra code over the excellent code from https://github.com/fss/solis-inverter to connect the data to the openenergymonitor emoncms.org system.

# USAGE

- clone this repo
- run `npm i` to install dependencies (requires node.js to be installed)
- copy the `.env-sample` and save as `.env`
- edit the .env file to match your requirements
  - you can get your api key from https://emoncms.org/user/view (or your installation address)
  - the solis IP address will depend on your local wifi network. Your wifi router should have an admin page with a list of connected devices. Try going the different IP address in a browser window - the ginlong will pop up a login, default username password is admin/admin.
- run `npm start`

# Full output from wifi logging stick

Note - this version only sends 'power' and 'time' to the emoncms.

```json
{
  "lastSeen": 1582915468053,
  "inverter": {
    "model": "0123",
    "serial": "1234567890ABCDE",
    "firmwareMain": "0123",
    "firmwareSlave": "0122"
  },
  "logger": {
    "serial": "1234567890",
    "version": "MW_08_0501_1.58",
    "mode": "STA",
    "ap": {
      "ssid": "AP_1213456789",
      "ip": "1.1.1.1'",
      "mac": "ABABABABABAB"
    },
    "sta": {
      "ssid": "NETWORK_NAME",
      "ip": "2.2.2.2",
      "mac": "AABBCCDDEEFF",
      "rssi": "99%"
    }
  },
  "remoteServer": {
    "a": true,
    "b": false
  },
  "power": 9999,
  "energy": {
    "today": 15,
    "total": 600
  }
}
```
