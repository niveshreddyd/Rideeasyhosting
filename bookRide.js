

const baseUrl = "http://13.48.136.44:3009" 
let passenegerDetails = null; 
let pendingRideId = null
async function getPassengerProfile() {
  let data = JSON.parse(localStorage.getItem(`localPassenger`));
  let dbDataPresent = false;
  if (JSON.parse(localStorage.getItem(`dbPassenger`))) {
    data = JSON.parse(localStorage.getItem(`dbPassenger`));
    passenegerDetails = data;
    dbDataPresent = true;
  }

  try {
    if (!dbDataPresent) {
      const res = await fetch(`${baseUrl}/passenger/contact_no/${data.contact_no}`)
      const response = await res.json()
   
          console.log(response);
          [passenegerDetails] = response.data;

          if(!passenegerDetails){
            throw 'No passenegerDetails came from dbDataPresent';
          }
          localStorage.setItem(
            `dbPassenger`,
            JSON.stringify(passenegerDetails)
          );
    }

    var recordElement = document.createElement("div");
    recordElement.innerHTML = `
            <p>NAME: ${passenegerDetails.name}</p>
            <p>Email: ${passenegerDetails.email}</p>
            <p>Address: ${passenegerDetails.address}</p>
            <p>Contac No: ${passenegerDetails.contact_no}</p>
            <hr>
        `;

    var passengerProfile = document.getElementById("passengerProfie");
    passengerProfile.innerHTML = "";
    passengerProfile.appendChild(recordElement);
  } catch (error) {
    console.log("Error", error);
  }
}

async function bookRide() {
  try {
    const optionalChoiceRadioButtons = document.getElementsByName("optionalChoice");
    let selectedOptionalChoice = null;

    for (const radioButton of optionalChoiceRadioButtons) {
      if (radioButton.checked) {
        selectedOptionalChoice = {
          value: radioButton.value,
          id: radioButton.id,
        };
        break;
      }
    }

    let body = {
      pickup_location: document.getElementById("pickup_location").value,
      drop_location: document.getElementById("drop_location").value,
      passenger_id: passenegerDetails.id,
      preference: selectedOptionalChoice.value
    };

    const res = await fetch(`${baseUrl}/ride`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const response = await res.json();
    console.log(response.data);
    alert(`RIDE BOOKED SUCCESSFULLY RIDE ID: ${response.data}`);
   
     const rideId = response.data

      if (rideId) {
        localStorage.setItem('currentRideIdPassenger', JSON.stringify({ id: rideId }));
      }

      await pageRender();

  } catch (error) {
    console.log("Error", error);
  }
}

async function paymentPage() {
  window.location.href = "paymentPage.html";
}




async function getPassengerPendingRide() {
let rideGlobal = null
alert("getPassengerPendingRide HITT")
  try {

    if(JSON.parse(localStorage.getItem('currentRideIdPassenger'))){
      let rideId = JSON.parse(localStorage.getItem('currentRideIdPassenger')).id
    const res = await fetch(`${baseUrl}/ride/getRideDetailsById/${rideId}`)
    const response = await res.json()
  
        console.log(response.data);
       const [ride] = response.data;
       rideGlobal = ride
        
if(ride && ride.id){
  if(ride.status== 'CONFIRMED'){
    window.location.href = "onGoingRidePassenger.html";
  }
  var rideContainer = document.getElementById("rideContainer");


  rideContainer.innerHTML = "";



  var recordElement = document.createElement("div");
  recordElement.id = `ride/${ride.id}`;
  if(ride.status == 'COMPLETED'){
    recordElement.innerHTML = `
    <p>pickup_location: ${ride.pickup_location}</p>
    <p>drop_location: ${ride.drop_location}</p>
    <p>fare: ${ride.expected_fare}</p>
    <p>distance: ${ride.distance}</p>
    <p id="rideStatus">STATUS: ${ride.status}</p>
    <hr>
`;
  }else{
    recordElement.innerHTML = `
    <p>pickup_location: ${ride.pickup_location}</p>
    <p>drop_location: ${ride.drop_location}</p>
    <p>fare: ${ride.expected_fare}</p>
    <p>distance: ${ride.distance}</p>
    <p id="rideStatus">STATUS: ${ride.status}</p>
    <button type="button" onclick="cancelRide()" >CANCEL RIDE</button>
    <hr>
`;
    
  }

  rideContainer.appendChild(recordElement);
  alert('NEW RIDE DATA FETCHED');
}
}
   
  } catch (error) {
    console.log("Error", error);
  } finally {
  }
}






async function cancelRide(rideId) {
  try {
    let body = {
      ride_id: rideId,
    }
    const res = await fetch(`${baseUrl}/ride/cancelRide`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    } )
    
    const response = await res.json()

    console.log(response.data);
    if(localStorage.getItem('currentRideIdPassenger')){localStorage.removeItem('currentRideIdPassenger')}
    alert("RIDE  CANCELED");

    var rideElement = document.getElementById(`ride/${rideId}`);
    if (rideElement) {
      rideElement.remove();
      console.log(`Ride with id ${rideId} denied and removed from the list`);
    }
    await pageRender();
  } catch (error) {
    console.error(`Error denying ride with id ${rideId}:`, error);
  }
}

async function pageRender() {
  try{
  await getPassengerProfile();

    await getPassengerPendingRide();

  }
  catch(error){
    console.log("Error",error)
  }finally{

  }
}