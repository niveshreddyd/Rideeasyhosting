

const baseUrl = "http://13.48.136.44:3009" 

async function choosePaymentMode() {
    var selectedPaymentMode = document.getElementById("paymentDropDown").value;
    var recordsContainer = document.getElementById("payButton");

    // Clear the existing content in the container
    recordsContainer.innerHTML = "";

    let recordElement = document.createElement('div');
    recordElement.id = `payButtonRecord`;
    recordElement.innerHTML = ``;

    document.getElementById("selectedPaymentMode").textContent = "Selected Payment Mode: " + selectedPaymentMode;

    alert(`${selectedPaymentMode}`);
    if (selectedPaymentMode == '') {
        return;
    } else if (selectedPaymentMode == 'CASH' || selectedPaymentMode == 'ONLINE') {
        recordElement.innerHTML = `
            <button class="deny-button" onclick="pay()">PAY</button>
        `;
        recordsContainer.appendChild(recordElement);
    } else if (selectedPaymentMode == 'CARD') {
        recordElement.innerHTML = `
            <form id="paymentForm">
                <label for="cardNumber">Card Number:</label>
                <input type="text" id="cardNumber" name="cardNumber" required>
                <br>
                <label for="expiryDate">Expiry Date:</label>
                <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required>
                <br>
                <label for="cvv">CVV:</label>
                <input type="text" id="cvv" name="cvv" required>
                <br>
                <button type="button" class="deny-button" onclick="pay()">PAY</button>
            </form>
        `;
        recordsContainer.appendChild(recordElement);
    }
}

async function goToBookRidePage(){
 window.location.href = "bookRideDashboard.html"
}
async function pay() {
    try {
        var selectedPaymentMode = document.getElementById("paymentDropDown").value;
        let rideId = JSON.parse(localStorage.getItem(`currentRideIdPassenger`)).id;
        let body = {
            ride_id: rideId,
            payment_mode: selectedPaymentMode
        }
        if (selectedPaymentMode == 'CARD') {
            body['card_no'] = document.getElementById("cardNumber").value;
            body['expiry'] = document.getElementById("expiryDate").value;
        }

        const res = await fetch(`${baseUrl}/payment/createPaymentRecord`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Add any other headers as needed
            },
            body: JSON.stringify(body),
        })

        alert("Thank You!! For Riding With Us");

        var recordsContainer = document.getElementById("bookRidepage");

    recordsContainer.innerHTML = "";

    let recordElement = document.createElement('div');
    recordElement.innerHTML = `
    <button type="button" class="deny-button" onclick="goToBookRidePage()">BOOK A NEW RIDE</button>
    `;
    recordsContainer.appendChild(recordElement)
       
        } catch (err) {
        console.log(err);
    }
}

function getText(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        alert("valuee");
        alert(element.value)
      return element.value; // Get text content and remove leading/trailing whitespace
    } else {
      console.error(`Element with ID "${elementId}" not found.`);
      return "";
    }
  }
  
 
  console.log("Feedback:", feedbackText);

async function sendFeedback(){
    alert("FeebackHit")
    const feedbackText = getText("feedbackText");

    // var selectedPaymentMode = document.getElementById("paymentDropDown").value;
    let rideId = JSON.parse(localStorage.getItem(`currentRideIdPassenger`)).id;
    let body = {
        ride_id: rideId,
        feedback: feedbackText,
        rating: document.getElementById("selectRating").value
    }

alert(JSON.stringify(body))

    const res = await fetch(`${baseUrl}/feedback/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Add any other headers as needed
        },
        body: JSON.stringify(body),
    })

    alert(JSON.stringify(res))

    feedbackContainer = document.getElementById("feedbackContainer")
    
    feedbackContainer.innerHTML = `
    <h3>FEEDBACK SUBMITTED! Thank you for your feedback<h3>
    <button type="button" class="deny-button" onclick="goToBookRidePage()">BOOK A NEW RIDE</button>

    `;
    recordsContainer.appendChild(recordElement)
    
}
