// STORAGE

let services =
    JSON.parse(localStorage.getItem("services")) || [];



// PREDEFINED SERVICES

const availableServices = [

    "Google Auth API",
    "Google Maps API",
    "Stripe API",
    "Firebase Auth",
    "Neo4j Database",
    "OpenAI API",
    "GitHub API",
    "AWS S3",
    "Twilio SMS",
    "Redis Cache",
    "MongoDB",
    "PostgreSQL",
    "Docker Service",
    "Kubernetes Cluster"

];



// ELEMENTS

const popup =
    document.getElementById("popup");

const openPopupBtn =
    document.getElementById("openPopupBtn");

const closePopupBtn =
    document.getElementById("closePopupBtn");

const serviceSearch =
    document.getElementById("serviceSearch");

const searchResults =
    document.getElementById("searchResults");

const addServiceBtn =
    document.getElementById("addServiceBtn");

const servicesList =
    document.getElementById("servicesList");

const dependenciesList =
    document.getElementById("dependenciesList");

const existingServicesBoxes =
    document.getElementById("existingServicesBoxes");



// OPEN POPUP

openPopupBtn.addEventListener("click", () => {

    popup.style.display = "block";

    renderDependencies();

    renderExistingServices();

});



// CLOSE POPUP

closePopupBtn.addEventListener("click", () => {

    popup.style.display = "none";

});



// SEARCH SERVICES

serviceSearch.addEventListener("input", () => {

    const value =
        serviceSearch.value.toLowerCase();

    searchResults.innerHTML = "";

    const matches =
        availableServices.filter(service =>
            service.toLowerCase().includes(value)
        );

    matches.forEach(service => {

        const option =
            document.createElement("option");

        option.value = service;

        option.textContent = service;

        searchResults.appendChild(option);

    });

});



// ADD SERVICE

addServiceBtn.addEventListener("click", () => {

    const selectedServices =
        Array.from(searchResults.selectedOptions)
            .map(option => option.value);

    const endpoint =
        document.getElementById("endpointInput").value;

    const selectedDependencies =
        Array.from(
            document.querySelectorAll(
                ".dependencyCheckbox:checked"
            )
        ).map(checkbox => checkbox.value);


    selectedServices.forEach(service => {

        const newService = {

            name: service,

            endpoint: endpoint,

            dependencies: selectedDependencies

        };

        services.push(newService);

    });


    localStorage.setItem(
        "services",
        JSON.stringify(services)
    );


    renderServices();

    renderDependencies();

    renderExistingServices();


    // RESET POPUP

    serviceSearch.value = "";

    searchResults.innerHTML = "";

    document.getElementById(
        "endpointInput"
    ).value = "/api/v1/default";

});



// RENDER SERVICES

function renderServices() {

    servicesList.innerHTML = "";

    services.forEach(service => {

        const li =
            document.createElement("li");

        li.innerHTML = `

            <strong>${service.name}</strong>

            <br>

            Endpoint:
            ${service.endpoint}

        `;

        li.style.marginBottom = "15px";

        servicesList.appendChild(li);

    });

}



// RENDER DEPENDENCIES

function renderDependencies() {

    dependenciesList.innerHTML = "";

    services.forEach(service => {

        const label =
            document.createElement("label");

        label.innerHTML = `

            <input type="checkbox"
                   class="dependencyCheckbox"
                   value="${service.name}">

            ${service.name}

        `;

        dependenciesList.appendChild(label);

        dependenciesList.appendChild(
            document.createElement("br")
        );

    });

}



// RENDER EXISTING SERVICES

function renderExistingServices() {

    existingServicesBoxes.innerHTML = "";

    services.forEach(service => {

        const box =
            document.createElement("button");

        box.textContent = service.name;

        box.style.margin = "5px";

        existingServicesBoxes.appendChild(box);

    });

}



// SHOW GRAPH

document.getElementById("showGraphBtn")
    .addEventListener("click", () => {

        popup.style.display = "none";

        document.getElementById(
            "graphArea"
        ).innerHTML = `

            <h3>Neo4j Graph Placeholder</h3>

            <p>
                Graph visualization will appear here.
            </p>

        `;

    });




// TEST BUTTON

document.getElementById("testBtn")
    .addEventListener("click", () => {

        alert("Testing Services...");

    });




// DEPLOY BUTTON

document.getElementById("deployBtn")
    .addEventListener("click", () => {

        alert("Deploying To GitHub...");

    });




// BACK BUTTON

document.getElementById("backBtn")
    .addEventListener("click", () => {

       window.location.href = "homePage.html";

    });




// INITIAL RENDER

renderServices();