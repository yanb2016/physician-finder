import React, { useState, useEffect   } from 'react';
import './App.css';

function App() {
  // use hooks
  const [value, setValue] = useState('');
  // when app initialized, dont show marker,set showMarker to false
  const [showMarker, setShowMarker] = useState(false);
  // set initial coordinate in SF
  const [location, setLocation] = useState({lat: 37.7749, lng: -122.4194});
  // for demo
  const [address, setAddress] = useState('Physician address will display here.')

  // init google map
  let google = window.google;
  let geocoder = new google.maps.Geocoder();
  let map;

  // when user submit form, call 
  const handleSubmit = function(event) {
    event.preventDefault();
    setShowMarker(true)
    getAddress();
  } 

  // add from database
  function getAddress() {

    // trim and split user input
    const name = value.trim().split(' ');

    // first assume input contains first name and last name
    const firstName = name[0];
    let middleName;
    const lastName = name[name.length -1];

    // if input has middle, set the value to middlename
    if(name.length === 3) {
      middleName = name[1]
    }

    // put parameters in url, carring them to sever side
    const news_url = `/v1/physician/${firstName}/${middleName}/${lastName}`
    const request = new Request(news_url, {
      method: 'GET',
    });
    fetch(request)
      .then(res => {
        // if not found will return 400 code
        if(res.status === 400) {
          setAddress('No results matches your research');
          throw 400;
        } else {
          // if found, json()
          return res.json();
        }
      })
      .then(res => {
        // call codeAddress to get coordinate
        codeAddress(res.adress, res.city, res.state)
        setAddress(`${value}'s address is ${res.adress}, ${res.city}, ${res.state}`)
      })
      .catch(err => console.log(err))
  }

  // get coordinate with address 
  function codeAddress(address, city, state) {
    const query = `${address} ${city} ${state}`
    geocoder.geocode( { 'address': query}, function(results, status) {
      if (status === 'OK') {
        setLocation(results[0].geometry.location)
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  // update map when coordinate changed, and drop a new mark 
  useEffect(() => {
    map = new google.maps.Map(
      document.getElementById('map'), {zoom: 11, center: location});
    const marker = showMarker && new google.maps.Marker({position: location, map: map});
  }, [location]);

  return (
    <div className="App">
      <form class="form" onSubmit={(e) => handleSubmit(e)}>
        <label>
          Name
          <input className="inputText" type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
        </label>
        <input type="submit" value="Search" />
      </form>
      <div id="demoAddress">{address}</div>
      <div id="map"></div>
    </div>
  );
}

export default App;
