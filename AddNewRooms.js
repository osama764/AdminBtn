// configuration of Project 
const firebaseConfig = {
  apiKey: "AIzaSyC1pII7CHpUYKDELsSO6QV6AllnIUutCqg",
  authDomain: "smart-home-fb189.firebaseapp.com",
  databaseURL: "https://smart-home-fb189-default-rtdb.firebaseio.com",
  projectId: "smart-home-fb189",
  storageBucket: "smart-home-fb189.appspot.com",
  messagingSenderId: "395648266554",
  appId: "1:395648266554:web:1d9ec392d8c14ca6272003"
};

firebase.initializeApp(firebaseConfig);
// Get a reference to  RealTime Database service
const database = firebase.database();

// the browser will speech during lading page AddingRoom
function welcomeInRoom() {
  let welcomeMessage = new SpeechSynthesisUtterance(
    "Now you can add new rooms in your smart home"
  );
  let speech = window.speechSynthesis;
  welcomeMessage.rate = 0.7;
  speech.speak(welcomeMessage);
}

// calling function  welcomeInRoom()
window.onload = welcomeInRoom();

let addRoom = document.querySelector(".addRoom");
let contentAddRoom = document.querySelector(".contentAddRoom");
let close = document.querySelector(".close");

// button add New Room will appear form to add data of this Room
addRoom.addEventListener("click", (e) => {
  e.preventDefault();
  contentAddRoom.style.transform = "translateX(0vw)";
});

// this button will close form (adding data of Room)
close.addEventListener("click", (e) => {
  e.preventDefault();
  contentAddRoom.style.transform = "translateX(120vw)";
});

// initialization variables to use later
let nameRoom     = document.getElementById("nameRoom");
let imageRoom    = document.getElementById("imageRoom");
let select       = document.querySelector(".select");
let addNewRoom   = document.querySelector(".addNewRoom");
let contentRooms = document.querySelector(".contentRooms");
let body         = document.querySelector("body");
console.log(select)
// this button will add New Room in container Rooms after take data of this Room
addNewRoom.addEventListener("click", (e) => {
  e.preventDefault(); // To prevent the page from loading 

  // To ensure that the data is correct
  if (imageRoom.value != "" && nameRoom.value != "") {
    // calling Function add Room in RealTime Database in Firebase
    addNewRoomInFirebase();
    // close form and browser will speech that Room added 
    contentAddRoom.style.transform = "translateX(120vw)";
    let welcomeMessage = new SpeechSynthesisUtterance(
      "A new room has been added"
    );
    let speech = window.speechSynthesis;
    welcomeMessage.rate = 0.7;
    speech.speak(welcomeMessage);
  } else {
    // if data of Room can't correct will appear message above form ( color Red )
    let h5 = document.createElement("h5");
    h5.innerHTML = "Please Enter Data Correct !!";
    h5.classList = "alertMessage";
    contentAddRoom.prepend(h5);

    // Remove message after 3 seconds
    setTimeout(() => {
      let deletAlert = document.querySelector(".alertMessage");
      deletAlert.remove();
    }, 3000);
  }
});

// function add new Room in RealTime Database in firebase
function addNewRoomInFirebase() {

  // Taking the values ​​from the input fields for the room name and the room photo 
  nameRoom = $("#nameRoom").val();
  imageRoom = $("#imageRoom").val();

  // add values in this Object to send data to RealTime Database
  var data = {
    Name: nameRoom,
    image: imageRoom,
    devices: [],
    devicesPush: [],
  };

  // this function is plugin from jQuery to add Data in RealTime Database
  $.ajax({
    // url ===> my Project in RealTime Database
    url: "https://smart-home-fb189-default-rtdb.firebaseio.com/Rooms.json",
    method: "POST",
    data: JSON.stringify(data), // Add data after converting from object to String
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    success: function () {
      clearForm(); // calling function Clear Form
      alert("Data saved successfully");
      DisplayData() // Calling function display data from RealTime 
    },
    error: function () {
      alert("Failed to save Data");
    },
  });
}

// this function will delete values from input fields 
function clearForm() {
  $("#nameRoom").val("");
  $("#imageRoom").val("");
}

// this function will display all Rooms From RealTime Database 
function DisplayData() {
  $.ajax({
    url: "https://smart-home-fb189-default-rtdb.firebaseio.com/Rooms.json",
    method: "GET",
    dataType: "json",
    success: function (data) {
      contentRooms.innerHTML = "";

      for (var room in data) {
        let card = `
          <div  class="card border-0 p-3 m-2 text-center" style="background-image: url(images/${data[room].image}.jpg);">
          <i class="fa-solid fa-trash-can deletbtnThisRoom"></i>
            <h3 class="mt-3 mb-3 room__title">${data[room].Name}</h3>
            <button class="btn btn-warning  visit">Visit</button>
            <span style="opacity:0">${room}</span> 
          </div>
        `;
        contentRooms.innerHTML += card;
      }
    },
    error: function () {
      alert("Failed to load Data");
    },
  });
}

// calling function display during loading Page
window.onload = DisplayData();

// this is container for all Rooms
contentRooms.addEventListener("click", (e) => {
  
  // the Element that contains classes : ( card  border-0   p-3 m-2   text-center )


  if (e.target.classList == "btn btn-warning  visit") {

    // Fetching room data via this current element on which the event takes place
    const nameImage = e.target.parentElement.style.backgroundImage
    const nameRoom =
    e.target.parentElement.lastElementChild.previousElementSibling.previousElementSibling
    .innerHTML

    // Encrypt the data and send it to the home page in the url
    const encodedImage = encodeURIComponent(nameImage);
    const encodedName = encodeURIComponent(nameRoom);
    // path Home Page
    const url = 
      "ShowMyRooms.html?nameRoom=" +
      encodedName +
      "&nameImage=" +
      encodedImage;
    window.location.href = url;
  }

    // the Element that contains classes : ( fa-solid  fa-xmark  deletbtnThisRoom )
  if (e.target.classList == "fa-solid fa-trash-can deletbtnThisRoom") {
  
    // uid is id that use to delete this Room 
    let uid = e.target.parentElement.lastElementChild.innerHTML
    // passing uid in function to delete this Room
    deleteRoom(uid)
    // delete this Room from Dom ( static )
    e.target.parentElement.remove();
   }




})


let selectImage = document.querySelector(".select");
let closeImages = document.querySelector("#closeImages");

// button select image
selectImage.addEventListener("click", function (e) {
  e.preventDefault();
  containerImage.style.transform = " scale(1)";
});

// close list of Images
closeImages.addEventListener("click", function (e) {
  e.preventDefault();
  containerImage.style.transform = " scale(0)";
});

let containerSelectionImages = document.querySelector(
  ".containerSelectionImages"
);

// for loop ( 12 image ) : 12 is not fixed, it changes according to the number of images
for (let i = 1; i <= 12; i++) {
  let newImage = `
<div class="cardImage">
<img src="images/${i}.jpg" alt="">
<span>${i}</span>
</div>
`;
  containerSelectionImages.innerHTML += newImage;
}

const images = document.querySelectorAll(".cardImage img");

// in click any image will take name for this image and close List of Images
images.forEach(function (image) {
  image.addEventListener("click", function (event) {
    if (event.target.tagName.toLowerCase() === "img") {
      const card = event.target.closest(".cardImage");
      const span = card.querySelector("span");
      imageRoom.value = span.textContent;
      containerImage.style.transform = " scale(0)";
    }
  });
});

// this function use to delete Room by id
function deleteRoom(uid) {
  $.ajax({
      url:`https://smart-home-fb189-default-rtdb.firebaseio.com/Rooms/${uid}.json`,
      method:"DELETE",
      success:function () {
          alert("Room deleted successfully");
      },
      error:function () {
          alert("Failed to delete Room");
      }
  });
}
