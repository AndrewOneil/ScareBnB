mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/dark-v11', // style URL
  center: hauntedLocation.geometry.coordinates, // starting position [lng, lat]
  zoom: 14, // starting zoom

});

new mapboxgl.Marker({ "color": "#3f00bb" })
  .setLngLat(hauntedLocation.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h3>${hauntedLocation.title}</h3><p>${hauntedLocation.location}</p>`
      )
  )
  .addTo(map);