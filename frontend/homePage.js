// COLLECTION STORAGE

let collections = JSON.parse(localStorage.getItem("collections")) || [];


// ELEMENTS

const newCollectionBtn =
    document.getElementById("newCollectionBtn");

const existingCollectionBtn =
    document.getElementById("existingCollectionBtn");

const newPopup =
    document.getElementById("newPopup");

const existingPopup =
    document.getElementById("existingPopup");

const closeNewPopup =
    document.getElementById("closeNewPopup");

const closeExistingPopup =
    document.getElementById("closeExistingPopup");

const createCollectionBtn =
    document.getElementById("createCollectionBtn");

const enterExistingBtn =
    document.getElementById("enterExistingBtn");

const collectionList =
    document.getElementById("collectionList");

const profileBtn =
    document.getElementById("profileBtn");



// PROFILE BUTTON

profileBtn.addEventListener("click", () => {

    window.location.href = "profile.html";

});



// OPEN NEW COLLECTION POPUP

newCollectionBtn.addEventListener("click", () => {

    newPopup.style.display = "block";

});



// OPEN EXISTING COLLECTION POPUP

existingCollectionBtn.addEventListener("click", () => {

    existingPopup.style.display = "block";

});



// CLOSE NEW POPUP

closeNewPopup.addEventListener("click", () => {

    newPopup.style.display = "none";

});



// CLOSE EXISTING POPUP

closeExistingPopup.addEventListener("click", () => {

    existingPopup.style.display = "none";

});



// CREATE COLLECTION

createCollectionBtn.addEventListener("click", () => {

    const projectName =
        document.getElementById("projectName").value;

    const password =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const emails =
        document.getElementById("emails").value;

    const projectType =
        document.getElementById("projectType").value;


    // VALIDATION

    if(projectName === "") {

        alert("Enter project name");

        return;
    }

    if(password !== confirmPassword) {

        alert("Passwords do not match");

        return;
    }


    // CREATE OBJECT

    const newCollection = {

        name: projectName,

        password: password,

        collaborators: emails,

        projectType: projectType,

        dateCreated: new Date().toLocaleDateString()

    };


    // SAVE COLLECTION

    collections.push(newCollection);

    localStorage.setItem(
        "collections",
        JSON.stringify(collections)
    );


    // RENDER UPDATED LIST

    renderCollections();

    alert("Collection Created Successfully");

    newPopup.style.display = "none";

    window.location.href = "mainPage.html";

    // REDIRECT TO MAIN PAGE

    window.location.href = "mainPage.html";

});




// ENTER EXISTING COLLECTION

enterExistingBtn.addEventListener("click", () => {

    const collectionName =
        document.getElementById("existingCollectionName").value;

    const password =
        document.getElementById("existingPassword").value;


    const foundCollection = collections.find(
        collection =>
            collection.name === collectionName &&
            collection.password === password
    );


    if(foundCollection) {

        localStorage.setItem(
            "activeCollection",
            collectionName
        );

        alert("Access Granted");


        // REDIRECT

        window.location.href = "mainPage.html";

    }

    else {

        alert("Wrong collection name or password");

    }

});




// RENDER COLLECTIONS

function renderCollections() {

    collectionList.innerHTML = "";


    collections.forEach(collection => {

        const li = document.createElement("li");


        li.style.border = "1px solid black";

        li.style.padding = "10px";

        li.style.marginBottom = "10px";

        li.style.cursor = "pointer";


        li.innerHTML = `

            <h3>${collection.name}</h3>

            <p>
                <strong>Date Created:</strong>
                ${collection.dateCreated}
            </p>

            <p>
                <strong>Type:</strong>
                ${collection.projectType}
            </p>

        `;


        // CLICK COLLECTION

        li.addEventListener("click", () => {

            document.getElementById(
                "existingCollectionName"
            ).value = collection.name;

            existingPopup.style.display = "block";

        });


        collectionList.appendChild(li);

    });

}



// INITIAL RENDER

renderCollections();