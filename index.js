function initMap() {
    fetch("locations.json")
    .then(function(response) {
        return response.json();
    })
    .then(function (city) {
        init(city);
    })
    .catch(function(e) {
        console.log(e);
    });
  
}
function init(city){
    let image = {
        url: 'markerBlue.png',
        scaledSize: new google.maps.Size(50, 50)
    };

    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: city  
    });
    city.markers.forEach(element => {
    
        let marker = new google.maps.Marker({
            position: element,
            map: map,
            icon: image,
            content: contentString
        });
        var contentString = `
        <div>
            <h1>${element.modal[0].title}</h1>
            <hr>
            <p>${element.modal[0].description}</p>
        </div>`;

        let infowindow = new google.maps.InfoWindow({
            content: contentString
        })
        google.maps.event.addDomListener(marker, 'click', function () {
            infowindow.open(map, marker)
        })
        city.markers.forEach(desti => {
            //console.log(element);
            var origin = new google.maps.LatLng(element.lat, element.lng);
            if(element.place !== desti.place) {
                var destination = new google.maps.LatLng(desti.lat, desti.lng);
                
                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: 'DRIVING',
                },(response, value) => {
                
                    document.getElementById("recorreguts").innerHTML += `
                        <div>
                            <h4>${response.originAddresses["0"].substring(0, response.originAddresses["0"].indexOf(','))}</h4>
                            <h4>${response.destinationAddresses["0"].substring(0, response.destinationAddresses["0"].indexOf(','))}</h4>
                            <h4>${response.rows["0"].elements["0"].distance.text}</h4>
                            <h4>${response.rows["0"].elements["0"].duration.text}</h4>
                            <hr>
                        </div>
                    
                    `;
                }
                
                );
            }  
        });
    });
}

