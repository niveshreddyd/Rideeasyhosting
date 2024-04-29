

const baseUrl = "http://13.48.136.44:3009"
let driverDetails = JSON.parse(localStorage.getItem(`dbDriver`));

async function getRides() {
    try {
        let rides = null
        const res = await fetch(`${baseUrl}/ride/available`)
        const response = await res.json()
       console.log(response.data)
            rides = response.data
            if(!rides.length){
                //
            }
      
        var ridesContainer = document.getElementById('ridesContainer');

        // Clear existing content
        ridesContainer.innerHTML = '';

        rides.map(function (ride) {
            var recordElement = document.createElement('div');
            recordElement.id = `ride/${ride.id}`;
            recordElement.innerHTML = `
                <p>pickup_location: ${ride.pickup_location}</p>
                <p>drop_location: ${ride.drop_location}</p>
                <p>pickup_time: ${ride.preference}</p>
                <p>Distance : ${ride.distance}</p>
                <button class="accept-button" onclick="handleAcceptClick(${ride.id})">Accept</button>
                <button class="deny-button" onclick="denyRide(${ride.id})">Deny</button>
                <hr>
            `;
            ridesContainer.appendChild(recordElement);
        });
    } catch (error) {
        console.log("Error", error);
    } finally {
        // Call getRides again after a delay (e.g., 8 seconds)
        setTimeout(async () => {
          await getRides();
      }, 8000);
    }
}

async function handleAcceptClick(rideId) {
    try {
        const response = await fetch(`${baseUrl}/ride/updateDriverStatus`,
        {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              // Add any other headers as needed
            },
            body: JSON.stringify({
                "driver_id": driverDetails.id,
                "ride_id": rideId,
                "status":'CONFIRMED'
            }),
          }
        ).then((res)=>{return res.json()})
        .then((response)=>{
            console.log(response)
        })
 
        localStorage.setItem('currentRideIdDriver',JSON.stringify({id:rideId}))
        alert("RIDE ACCEPTED");
        window.location.href = 'driverOnGoingRide.html';
    } catch (error) {
        console.error(`Error accepting ride with id ${rideId}:`, error);
    }
}

async function gotoDashboard() {
    window.location.href = 'driverDashboard.html';
}

async function denyRide(rideId) {
    try {
        const response = await fetch(`${baseUrl}/ride/updateDriverStatus`,  {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              // Add any other headers as needed
            },
            body: JSON.stringify({
                "driver_id": driverDetails.id,
                "ride_id": rideId,
                "status":'DENIED'
            }),
          }
        ).then((res)=>{return res.json()})
        .then((response)=>{
            console.log(response)
        })

       
        alert("RIDE DENIED");

        var rideElement = document.getElementById(`ride/${rideId}`);
        if (rideElement) {
            rideElement.remove();
            console.log(`Ride with id ${rideId} denied and removed from the list`);
        }
    } catch (error) {
        console.error(`Error denying ride with id ${rideId}:`, error);
    }
}

