const express = require("express");
const axios = require("axios");
const http = require("http");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: '*',
  }
});

var damagedList = [];

const citybikeurl = "https://api.citybik.es/v2/networks/decobike-miami-beach?fields=stations";
server.listen(port, () => console.log(`Listening on port ${port}`));

io.on("connection", socket => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log('New connection ' + socketId + ' from ' + clientIp);

  getApiAndEmit(socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("markDamaged", param => {
    damagedList.push(param);
    getApiAndEmit(socket);
  });

  socket.on("markFunctional", param => {
    var i = damagedList.indexOf( param );
    damagedList.splice( i, 1);
    console.log(damagedList)
    getApiAndEmit(socket);
  });
  
});

const  getApiAndEmit = async socket => {
  await axios.get(citybikeurl).then(res => {
    let data = res.data.network.stations.map((station, key) => {
      station.isDamaged = damagedList.includes(station.id);
      return station;
    });
    socket.emit('getData', data );
  }).catch(err => {
    console.log(err);
    getApiAndEmit(socket);
  })
};




