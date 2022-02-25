let employees = [];

function fetchData(){
    fetch('https://pract-4-37bf5-default-rtdb.firebaseio.com/employees.json')
        .then(res => {
            if(res.ok){
                return res.json();
            }
        })
        .then(data => {
            for(const id in data){
                employees.push({
                    id,
                    fullName: `${data[id].title} ${data[id].firstName} ${data[id].middleName} ${data[id].lastName}`,
                    gender: data[id].gender,
                    email: data[id].email,
                    contact: data[id].contact,
                    residentialAddress: `${data[id].houseNo}, ${data[id].addressLine1} ${data[id].addressLine2}, ${data[id].landmark}, ${data[id].city}, ${data[id].state}, ${data[id].country}, ${data[id].pincode}`,
                    designation: data[id].designation,
                    techKnownArr: data[id].techKnownArr.toString(),
                    relevantExperience: data[id].experience,
                    totalExperience: data[id].totalExperience,
                });
            }
            renderDataInTheTable(employees);
            console.log(employees);
        })
        .catch(err => {
            console.log(err);
        });
}

async function submitForm(event){
    event.preventDefault();

    let title = document.getElementById("selectTitle").value.trim();
    let firstName = document.getElementById("firstName").value.trim();
    let middleName = document.getElementById("middleName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let gender = document.getElementById("radioMale").value.trim();
    if(document.getElementById("radioFemale").checked){
        gender = document.getElementById("radioFemale").value.trim();
    }
    let email = document.getElementById("email").value.trim();
    let contact = document.getElementById("contact").value.trim();
    let houseNo = document.getElementById("houseNo").value.trim();
    let landmark = document.getElementById("landmark").value.trim();
    let addressLine1 = document.getElementById("addressLine1").value.trim();
    let addressLine2 = document.getElementById("addressLine2").value.trim();
    let country = document.getElementById("country").value.trim();
    let state = document.getElementById("state").value.trim();
    let city = document.getElementById("city").value.trim();
    let pincode = document.getElementById("pincode").value.trim();
    let designation = document.getElementById("designation").value.trim();
    let techKnownArr = [];
    let technologiesKnown = document.getElementsByName('techKnown');

    for (let tech of technologiesKnown){
        if(tech.checked){
            techKnownArr.push(tech.value);
        }
    }

    let experience = document.getElementById("experience").value;
    let careerStart = document.getElementById("careerStart").value;

    let totalExperience = '';
    let startDate = new Date(careerStart);
    let currentDate = new Date();
    let months = (12 * (currentDate.getFullYear() - startDate.getFullYear())) + currentDate.getMonth() - startDate.getMonth();
    if(months >= 12){
        let expe = months/12;
        expe = expe.toFixed(2);
        totalExperience = '' + expe;
    }
    else if(months < 12){
        totalExperience = '0.' + months;
    }
    
    const response = await fetch('https://pract-4-37bf5-default-rtdb.firebaseio.com/employees.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          firstName,
          middleName,
          lastName,
          gender,
          email,
          contact,
          houseNo,
          landmark,
          addressLine1,
          addressLine2,
          country,
          state,
          city,
          pincode,
          designation,
          techKnownArr,
          experience,
          careerStart,
          totalExperience,
        }),
    });
    console.log(response);
    window.location.reload();
}

function checkRequired(){
    let techKnownArr = [];
    let technologiesKnown = document.getElementsByName('techKnown');
    for (let tech of technologiesKnown){
        if(tech.checked){
            techKnownArr.push(tech.value);
        }
    }
    if(techKnownArr.length > 0){
        for (let tech of technologiesKnown){
            tech.removeAttribute("required");
        }
    }
    else{
        for (let tech of technologiesKnown){
            tech.setAttribute("required", "");
        }
    }
}

function setMaxDate(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    } 
        
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("careerStart").setAttribute("max", today);
}

function renderDataInTheTable(empData) {
    const mytable = document.getElementById("employee-data");
    empData.forEach(emp => {
        let newRow = document.createElement("tr");
        Object.values(emp).forEach((value) => {
            let cell = document.createElement("td");
            cell.innerText = value;
            newRow.appendChild(cell);
        });
        let btnCell = document.createElement("td");
        let btn = document.createElement("button");
        btn.innerHTML = "Delete";
        btn.classList.add("btn", "btn-danger");
        btn.onclick = function(){
            console.log(emp.id);
            fetch(`https://https://pract-4-37bf5-default-rtdb.firebaseio.com/employees/${emp.id}.json`,{
                method: 'Delete',
                headers: {
                  'Content-Type': 'application/json'
                },
            })
            .then(res => {
                if(res.ok){
                    return res.json();
                }
            })
            .then(data => {
                console.log(data);
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
        };
        btnCell.appendChild(btn);
        newRow.appendChild(btnCell);
        mytable.appendChild(newRow);
    });
}