

const baseUrl = "http://13.48.136.44:3009" 
let driverDetails = null; // DB DATA OF DRIVER BEFORE QUERY

async function getDriverProfile() {
    let data = JSON.parse(localStorage.getItem('localDriver'));
    let dbDataPresent = false;

    if (JSON.parse(localStorage.getItem('dbDriver'))) {
        data = JSON.parse(localStorage.getItem('dbDriver'));
        driverDetails = data;
        dbDataPresent = true;
    }

    try {
        if (!dbDataPresent) {
            const res = await fetch(`${baseUrl}/driver/contact_no/${data.contact_no}`);
            const response = await res.json();

            console.log(response.data);
            [driverDetails] = response.data;

            if (!driverDetails) {
                throw 'No driverDetails came from dbDataPresent';
            }

            localStorage.setItem('dbDriver', JSON.stringify(driverDetails));
        }

        var recordElement = document.createElement('div');
        recordElement.innerHTML = `
            <p>NAME: ${driverDetails.name}</p>
            <p>Email: ${driverDetails.email}</p>
            <p>Address: ${driverDetails.address}</p>
            <p>Contact No: ${driverDetails.contact_no}</p>
            <p>RATING: ${driverDetails.rating}</p>
            <hr>
        `;

        var driverProfile = document.getElementById('driverProfile');
        driverProfile.innerHTML = '';
        driverProfile.appendChild(recordElement);
    } catch (error) {
        console.log('Error', error);
    }
}

async function addVehicle() {
    try {
        let body = {
            type: document.getElementById('type').value,
            model: document.getElementById('model').value,
            capacity: document.getElementById('capacity').value,
            vehicle_no: document.getElementById('vehicle_no').value,
            music_rating: document.getElementById('music_rating').value,
            temperature_rating: document.getElementById('temperature_rating').value,
            driver_id: driverDetails.id,
        };

        const res = await fetch(`${baseUrl}/vehicle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers as needed
            },
            body: JSON.stringify(body),
        });

        const response = await res.json();
        // alert()
        console.log(response);

        alert(`NEW VEHICLE ADDED SUCCESSFULLY ${response.data} `);
        toggleAddVehiclePopup();
        await pageRender();
    } catch (error) {
        console.log('Error', error);
    }
}

function toggleAddVehiclePopup() {
    var popup = document.getElementById('addVehiclePopup');
    if (popup.style.display === 'none') {
        popup.style.display = 'block';
    } else {
        popup.style.display = 'none';
    }
}

async function getVehicles() {
    try {
        const res = await fetch(`${baseUrl}/vehicle/driver_id/${driverDetails.id}`);
        const response = await res.json();
        console.log(response);
        alert(response)

        var vehiclesContainer = document.getElementById('vehiclesContainer');

        // Clear existing content
        vehiclesContainer.innerHTML = '';

        // Use map to create elements for each record and append them to the container
        response.data.map(function (vehicle) {
            var recordElement = document.createElement('div');
            recordElement.innerHTML = `
                <p>TYPE: ${vehicle.type}</p>
                <p>MODEL: ${vehicle.model}</p>
                <p>CAPACITY: ${vehicle.capacity}</p>
                <p>MUSIC: ${vehicle.music_rating}</p>
                <p>TEMPERATURE: ${vehicle.temperature_rating}</p>
                <p>VEHICLE NO: ${vehicle.vehicle_no}</p>
                <hr>
            `;
            vehiclesContainer.appendChild(recordElement);
        });

        alert('NEW VEHICLE DATA FETCHED');
    } catch (error) {
        console.log('Error', error);
    }
}

async function getDriverRidesData (){
    const res = await fetch(`${baseUrl}/driver/getDriverRidesData/${driverDetails.id}`);
    const response = await res.json();
    console.log(response);
    var totalRidesContainer = document.getElementById('totalRidesContainer');
    var earningsContainer = document.getElementById('earningsContainer');
    var commentsRatingsContainer = document.getElementById('commentsRatingsContainer');
    if(response.data.length){
    response.data.map(function (i) {
        var recordElement = document.createElement('div');
        recordElement.innerHTML = `
       
            <p>COMMENT: ${i.comment}</p>
            <p>RATING: ${i.rating}</p>
            <hr>
        `;
        commentsRatingsContainer.appendChild(recordElement);
    });

    earningsContainer.innerHTML = ` <h3>PREVIOUS RIDIES<h3><span></span><p>TOTAL Earnings: ${response.data[0].total_earning || 0}</p>`;
    totalRidesContainer.innerHTML = `<p>TOTAL RIDES: ${response.data.length || 0}</p>`;
}

}

async function gotoRidesPage() {
    window.location.href = 'driverRides.html';
}

async function pageRender() {
    try {
        await getDriverProfile();
        await getDriverRidesData();
        await getVehicles();
    } catch (error) {
        console.log('Error', error);
    }
}
