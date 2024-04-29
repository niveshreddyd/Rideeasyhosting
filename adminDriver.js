let globalData = []


const baseUrl = "http://13.48.136.44:3009"
const pageRender = () => {
    driverPopulate();
}

const driverPopulate = async() => {
    let container = document.getElementById('driverContainer') || document.createElement('div');

    const res = await fetch(`${baseUrl}/admin/getDriversData`);
    const response = await res.json();

    console.log(response.data);

    // let data = [
    //     {
    //         'id':'1',
    //         'name': "hitman",
    //         'contact_no': "1234567890",
    //         'address': "1234 main street",
    //         'password': "123123",
    //         'rating':'4',
    //         'account_no':34724692,
    //         'online_id':3482542858,
    //         'email':'hitnan@gmail.com',
    //         'total_earning':999,

    //     },
    //     {
    //         'id':'2',
    //         'name': "hitman 2",
    //         'contact_no': "1234567890",
    //         'address': "1234 main street",
    //         'password': "123123",
    //         'rating':'4',
    //         'account_no':34724692,
    //         'online_id':3482542858,
    //         'email':'hitnan@gmail.com',
    //         'total_earning':999,
    //     },
    //     {
    //         'id':'3',
    //         'name': "hitman 3",
    //         'contact_no': "1234567890",
    //         'address': "1234 main street",
    //         'password': "123123",
    //         'rating':'4',
    //         'account_no':34724692,
    //         'online_id':3482542858,
    //         'email':'hitnan@gmail.com',
    //         'total_earning':999,
    //     },
    //     {
    //         'id':'4',
    //         'name': "hitman 4",
    //         'contact_no': "1234567890",
    //         'address': "1234 main street",
    //         'password': "123123",
    //         'rating':'4',
    //         'account_no':34724692,
    //         'online_id':3482542858,
    //         'email':'hitnan@gmail.com',
    //         'total_earning':999,
    //     }
    // ];

    let data = response.data

    globalData = data

    let html = '<table><thead><tr>';

    // Generate table header
    Object.keys(data[0]).forEach(key => {
        html += `<th>${key}</th>`;
    });

    // Add Actions column
    html += '<th>Actions</th>';

    html += '</tr></thead><tbody>';

    // Generate table rows
    data.forEach((row, index) => {
        html += `<tr>`;
        Object.entries(row).forEach(([key, value]) => {
           
            html += `<td id="${key}${index}" data-editable="false">${value}</td>`;
        });
        // Add edit, cancel, and save buttons
        html += `<td>
                    <button onclick="editDriver(${index})">Edit</button>
                    <button onclick="cancelEdit(${index})" style="display:none;">Cancel</button>
                    <button onclick="saveEdit(${index})" style="display:none;">Save</button>
                </td>`;
        html += `</tr>`;
    });

    html += '</tbody></table>';

    container.innerHTML = html;
}

function editDriver(index) {
    const editButton = document.getElementById(`driverContainer`).querySelectorAll('button')[index * 3];
    const cancelButton = editButton.nextElementSibling;
    const saveButton = cancelButton.nextElementSibling;

    // Hide edit button, show cancel and save buttons
    editButton.style.display = 'none';
    cancelButton.style.display = 'inline';
    saveButton.style.display = 'inline';

    // Make table cells editable
    const rowCells = document.querySelectorAll(`#driverContainer tr:nth-child(${index + 1}) td`);
    rowCells.forEach(cell => {

        
        if(!cell.id.startsWith('id')){
        console.log(cell.id)
        cell.setAttribute('contenteditable', 'true');
        cell.dataset.editable = 'true';
        }
    });
}

function cancelEdit(index) {
    const cancelButton = document.getElementById(`driverContainer`).querySelectorAll('button')[index * 3 + 1];
    const editButton = cancelButton.previousElementSibling;
    const saveButton = cancelButton.nextElementSibling;

    // Show edit button, hide cancel and save buttons
    editButton.style.display = 'inline';
    cancelButton.style.display = 'none';
    saveButton.style.display = 'none';

    // Make table cells non-editable
    const rowCells = document.querySelectorAll(`#driverContainer tr:nth-child(${index + 1}) td`);
    rowCells.forEach(cell => {
        if (cell.dataset.editable === 'true') {
            cell.setAttribute('contenteditable', 'false');
        }
    });
}

async function saveEdit(index) {
    console.log("INTO SAVE");
    console.log('index',index)
    const id = document.getElementById(`id${index}`);
    const nameField = document.getElementById(`name${index}`);
    console.log('nameField',nameField,nameField.innerText)
    const emailField = document.getElementById(`email${index}`);
    const addressField = document.getElementById(`address${index}`);
    const contactField = document.getElementById(`contact_no${index}`);
    const passwordField = document.getElementById(`password${index}`);
    const ratingField = document.getElementById(`rating${index}`);
    const earningField = document.getElementById(`total_earning${index}`);
    const accountField = document.getElementById(`account_no${index}`);
    const onlineidField = document.getElementById(`online_id${index}`);

    const editButton = nameField.parentElement.querySelector('button');
    const cancelButton = editButton.nextElementSibling;
    const saveButton = cancelButton.nextElementSibling;

    // const id = globalData.filter((i)=> i.contact_no == contactField.innerText).id

    const editedData = {
        id:id.innerText,
        name: nameField.innerText,
        contact_no: contactField.innerText,
        address: addressField.innerText,
        email: emailField.innerText,
        password: passwordField.innerText,
        rating: ratingField.innerText == null || ratingField.innerText == 'null' ? 5 : ratingField.innerText,
        total_earning: earningField.innerText,
        account_no:accountField.innerText,
        online_id:onlineidField.innerText
    };

    console.log('editedData', editedData);

    // Call your API endpoint with the edited data
    try {

        const res = await fetch(`${baseUrl}/admin/updateDriverByAdmin`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedData),
          } )
        const responseData = await response.json();
    
        console.log('Response:', responseData);

        alert('Succesfully updated!')
      
    } catch (error) {
        console.error('Error:', error);
    }

    nameField.contentEditable = false;
    contactField.contentEditable = false;
    addressField.contentEditable = false;
    emailField.contentEditable = false;
    addressField.contentEditable = false;
    passwordField.contentEditable = false;
     ratingField.contentEditable = false;
      earningField.contentEditable = false;
      accountField.contentEditable = false;
      onlineidField.contentEditable = false;


    editButton.style.display = 'inline';
    cancelButton.style.display = 'none';
    saveButton.style.display = 'none';
}
