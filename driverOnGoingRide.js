

const baseUrl = "http://13.48.136.44:3009" 
let rideDetail = null

async function rideDetails() {
    try {
      let rideId = null;
  
      if (JSON.parse(localStorage.getItem(`currentRideIdDriver`))) {
        rideId = JSON.parse(localStorage.getItem(`currentRideIdDriver`)).id;
      }
  
      alert(`rideId: ${rideId}, ${JSON.parse(localStorage.getItem(`currentRideIdDriver`))}`);
  
      if (rideId) {
        const res = await fetch(`${baseUrl}/ride/getRideDetailsById/${rideId}`);
        const response = await res.json();
  
        console.log("RESPONSE", response.data);
        
        const [ride] = response.data;

        rideDetail = ride;
        // Correct the variable name here
        const passenegerDetailsCall = await fetch(`${baseUrl}/passenger/getPassengerDetailsById/${ride.passenger_id}`)

        const passengerResult = await passenegerDetailsCall.json()
        alert(`hit data ${JSON.stringify(passengerResult)}`)
        const passengerDetails =  passengerResult.data;

        console.log("hitttted")
        
        if(passengerDetails.id){
            let rideContainer = document.getElementById('rideContainer');
    
            rideContainer.innerHTML = '';
      
            let recordElement = document.createElement('div');
            recordElement.id = `ride/${ride.id}`;
            recordElement.innerHTML = `
                <p>pickup_location: ${ride.pickup_location}</p>
                <p>drop_location: ${ride.drop_location}</p>
                <p>pickup_time: ${ride.pickup_time}</p>
                <p>Distance : ${ride.distance}</p>
                <p>Expected fare: ${ride.expected_fare}</p>
                <p>Passenger Name : ${passengerDetails.name}</p>
                <p>Passenger Contac_No : ${passengerDetails.contact_no}</p>
                <hr>
            `;
            rideContainer.appendChild(recordElement);
        }
      }
    }catch(error){
    }
  }

async function handleStatusChange(){
    // alert("status hit")
    var selectedStatus = document.getElementById("statusDropdown").value;
    alert(`${selectedStatus}`)
    if(selectedStatus==""){
        
        return
    }
    // const res = await fetch(`${baseUrl}/driver`)
    const driverDetails = JSON.parse(localStorage.getItem('dbDriver'))
    alert(`Driver Details${driverDetails}`)
    const res = await fetch(`${baseUrl}/ride/updateDriverStatus`,
    {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers as needed
        },
        body: JSON.stringify({
            "driver_id": driverDetails.id,
            "ride_id": rideDetail.id,
            "status":selectedStatus
        }),
      })

      if(selectedStatus=='COMPLETED'){
        //
        const res = await fetch(`${baseUrl}/ride/completeAndGetFare/${rideDetail.id}`,
            {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  // Add any other headers as needed
                },
              }
        )

       const fareResponse = await res.json()
       var fareContainer = document.getElementById("fareContainer");

  // Clear existing content
  fareContainer.innerHTML = ''
  var recordElement = document.createElement("div");
  recordElement.innerHTML = fareResponse.data
  fareContainer.appendChild(recordElement)
  // Use map to create elements for each record and append them to the container
    }
    

    const response = await res.json()
    // document.getElementById("selectedStatus").textContent = "Selected Status: " + selectedStatus;
    await pageRender()
}

async function recordPayment(){
  try {
      alert('PAYMENT RECORD')
        let rideId = rideDetail.id;
        let body = {
          ride_id:rideId,
          passenger_id:rideDetail.passenger_id,
          driver_id: rideDetail.driver_id,
        }
        console.log("HIIT RESPONSE")
        alert(`${JSON.stringify(body)}`)

        const res = await fetch(`${baseUrl}/rideHistory/createRideHistoryRecord`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Add any other headers as needed
            },
            body: JSON.stringify(body),
        })

        const response = await res.json()
         console.log(response.data)
        alert("Thank You!! Driver for Safe Ride");
        window.location.href = "driverRides.html"
  } catch (error) {
    // console.log(error)
  }
}

async function pageRender(){
    try{
        alert("page render");
        await rideDetails();
        // alert("Got details");
    }catch(error){
        console.log(error)
    }
}