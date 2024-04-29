

const baseUrl = "http://13.48.136.44:3009"

const pageRender = () => {
    basicDetails();
}

async function basicDetails() {
    let totalRides = document.getElementById('totalRides') || document.createElement('div');
    let totalDrivers = document.getElementById('totalDrivers') || document.createElement('div');
    let totalPassengers = document.getElementById('totalPassengers') || document.createElement('div');
    let totalDriversEarnings = document.getElementById('totalDriversEarnings') || document.createElement('div');
    let totalDistanceTravelled = document.getElementById('totalDistanceTravelled') || document.createElement('div');

    const res = await fetch(`${baseUrl}/admin/getRidesDataByAdmin`);
    const response = await res.json();

    // console.log(response.data);
    // // let data = [
    //     {
    //         'name': "hitman",
    //         'contact_no': "1234567890",
    //         'address': "1234 main street",
    //         'phone': "1234567890",
    //     },
    //     {
    //         'name': "hitman 2",
    //         'contact_no': "1234567890",
    //         'address': "1234 main street",
    //         'phone': "1234567890",
    //     },
    //     {
    //         'name': "hitman 3",
    //         'contact_no': "1234567890",
    //         'address': "1234 main street",
    //         'phone': "1234567890",
    //     },
    //     {
    //         'name': "hitman 4",
    //         'contact_no': "1234567890",
    //         'address': "1234 main street",
    //         'phone': "1234567890",
    //     }
    // ];

    let data  = response.data
    console.log('data',data)

    // let data = 
    //     {
    //         'totalRides': "59",
    //         'totalDrivers': "1234567890",
    //         'totalPassengers': "1234 main street",
    //         'totalDriversEarnings': "1234567890",
    //         'totalDistanceTravelled':50
    //     }




    let container = document.getElementById('totalData')

    container.innerHTML = `<div class="stat-block">
    <p><strong>TOTAL RIDES</strong></p>
    <p><strong>${data.totalRides}</strong></p>
  </div>
  
  <div class="stat-block">
    <p><strong>TOTAL DRIVERS</strong></p>
    <p><strong>${data.totalDrivers}</strong></p>
  </div>
  
  <div class="stat-block">
    <p><strong>TOTAL PASSENGERS</strong></p>
    <p><strong>${data.totalPassengers}</strong></p>
  </div>
  
  <div class="stat-block">
    <p><strong>TOTAL DRIVERS EARNINGS</strong></p>
    <p><strong>${data.totalDriversEarnings}</strong></p>
  </div>
  
  <div class="stat-block">
    <p><strong>TOTAL DISTANCE TRAVELLED</strong></p>
    <p><strong>${data.totalDistanceTravelled}</strong></p>
  </div>
  `
    





}