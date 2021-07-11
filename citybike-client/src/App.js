import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import axios from "axios";


export  const bikeIcon = new Icon({
  iconUrl: '/assets/bikeIcon.svg',
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});

export  const bikeIconDamaged = new Icon({
  iconUrl: '/assets/bikeIconDamaged.svg',
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});

class App extends Component {
  constructor() {
    super();

    this.socket = null;
    this.state = {
      response: [],
      endpoint: "http://127.0.0.1:4001",
      lat: 25.761681,
      lng: -80.191788,
      zoom: 12,
      statistics: []
    };

  }
  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);

    this.socket.on("getData", data => {
      this.setState({ response: data })
    });

    axios.get(endpoint + "/statistics")
      .then(res => this.setState({ statistics: res.data.body }))
      .catch(err => console.log(err))
   
  }


  markDamaged(id) {
    this.socket.emit("markDamaged", id);
  }


  markFunctional(id) {
    this.socket.emit("markFunctional", id);
  }


  render() {
    const { response, statistics } = this.state;
    const position = [this.state.lat, this.state.lng];

    const markers = response.map( (station, key) => {
      return <Marker position={[station.latitude, station.longitude]} icon={!station.isDamaged ? bikeIcon : bikeIconDamaged} key={station.id} >
          <Popup >
            <h3 className={station.isDamaged ? "damaged" : ""}>{station.name}</h3>
            <p>{station.extra.address}</p>
            <ul>
              <li>  Bicicletas libres: {station.free_bikes} </li>
              <li>  Espacios vacios: {station.empty_slots} </li>
              {
                !station.isDamaged ? 
                <button type="button" onClick={() => this.markDamaged(station.id)}>Marcar como dañado</button> :
                <button type="button" onClick={() => this.markFunctional(station.id)}>Marcar como funcional</button>
              }
              
            </ul>              
          </Popup>
       </Marker>
    });

    const main_used = statistics.main_used?.map( (station, key) => {
      return <div key={key} className="container">
                <div >
                <h2><b>{station.name}</b></h2>
                <h4>Día: {station.day}</h4>
                <h4>Dinero: {station.money}</h4>
                </div>
            </div>
    });

    const main_void = statistics.main_void?.map( (station, key) => {
      return <div key={key} className="container">
                <div >
                <h2><b>{station.name}</b></h2>
                  <h4>Día: {station.day}</h4>
                  <h4>Dinero: {station.money}</h4>     
                </div>
              </div>
    });

    return (
      <div className="map">
        <h1> City Bikes in Miami </h1>
        <MapContainer center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          { markers }
          
        </MapContainer>

        <h1> Principales estaciones utilizadas </h1>
        {main_used}

        <h1> Principales estaciones vacias </h1>
        {main_void}


      </div>
    );
  }
}

export default App;
