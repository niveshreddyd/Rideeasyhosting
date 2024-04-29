


const baseUrl = "http://13.48.136.44:3009" 
let rideDetail = null

async function rideDetails() {
    try {
      let rideId = null;
  
      if (JSON.parse(localStorage.getItem(`currentRideIdPassenger`))) {
        rideId = JSON.parse(localStorage.getItem(`currentRideIdPassenger`)).id;
      }
  
  
      if (rideId) {
        const res = await fetch(`${baseUrl}/ride/getRideDetailsById/${rideId}`);
        const response = await res.json();
  
        // console.log("RESPONSE", response.data);
        
        const [ride] = response.data;

        rideDetail = ride;
        // Correct the variable name here
        const driverDetailsCall = await fetch(`${baseUrl}/driver/getDriverById/${ride.driver_id}`)

        const driverResult = await driverDetailsCall.json()
        // alert(`hit data ${JSON.stringify(driverResult)}`)
        const driverDetails =  driverResult.data;

        // console.log("hitttted")
        
        if(driverDetails.id){
            let rideContainer = document.getElementById('rideContainer');
    
            // Clear existing content
            rideContainer.innerHTML = '';
      
            let recordElement = document.createElement('div');
            recordElement.id = `ride/${ride.id}`;
            recordElement.innerHTML = `
                <p>pickup_location: ${ride.pickup_location}</p>
                <p>drop_location: ${ride.drop_location}</p>
                <p>pickup_time: ${ride.pickup_time}</p>
                <p>Distance : ${ride.distance}</p>
                <p>Expected fare: ${ride.expected_fare}</p>
                <p>Driver Name : ${driverDetails.name}</p>
                <p>Driver Contac_No : ${driverDetails.contact_no}</p>
                <hr>
            `;
            rideContainer.appendChild(recordElement);
        }
      }
    }catch(error){
      console.log("Error in rideDetails", error);
    }
  }

  async function getFinalPrice(){
    try {
        
    alert("Final Price R3equested")
    const res = await fetch(`${baseUrl}/fare/getFareDetailsByRideId/${rideDetail.id}`);
    const response = await res.json();
    alert("Waiting")
    alert(`${JSON.stringify(response.data)}`)
    console.log("RESPONSE", response.data);
    const fareDetails = response.data
    if(fareDetails.id) {
        alert(fareDetails)
        let fareContainer = document.getElementById("finalPrice");
    
            // Clear existing content
            // fareContainer.innerHTML = '';
      
            let recordElement = document.createElement('div');
            
            recordElement.id = `fare/${fareDetails.id}`;
            recordElement.innerHTML = `
            <p>DISCOUNT: ${fareDetails.discount_amount} </p>
                <p>TOTAL: ${Number(Number(fareDetails.subtotal) + Number(fareDetails.service_charge) - Number(fareDetails.discount_amount)) }</p>
                <button class="deny-button" onclick="paymentPage()">PROCEED PAYMENT</button>
                <hr>
                
            `;
            fareContainer.appendChild(recordElement);
    }
} catch (error) {
        console.log("Error in getFinalPrice :",error)
}
  }

  async function paymentPage(){
    window.location.href = 'paymentPage.html';
  }

async function pageRender(){
    try{
        // alert("page render");
        await rideDetails();
        // alert("Got details");
    }catch(error){
        console.log(error)
    }
}