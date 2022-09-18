import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot,
    addDoc,
    enableMultiTabIndexedDbPersistence
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB7O0K-NnW7Zgzk_zrdaDbsTrS2tcFB0E4",
    authDomain: "lagos-club.firebaseapp.com",
    projectId: "lagos-club",
    storageBucket: "lagos-club.appspot.com",
    messagingSenderId: "124234626531",
    appId: "1:124234626531:web:cada5f691ce072a60f5cd6"
  };


initializeApp(firebaseConfig)

const db = getFirestore()

const colRef = collection(db, "membership")

onSnapshot(colRef, (onSnapshot) => {
  let members = []
  onSnapshot.docs.forEach(doc => {
    members.push({...doc.data()})
  })
  document.querySelector(".members-list").innerHTML = `
        ${members.map(member => {
          return `
          <div class="member">
            <div class="member-name">
                <h3>Name:</h3> <span>${member.name}</span>
            </div>
            <div class="member-occupation">
                <h3>occupation:</h3> <span>${member.occupation}</span>
            </div>
            <div class="member-Oaddress">
                <h3>Office Address:</h3> <span>${member.office}</span>
            </div>
            <div class="member-email">
                <h3>email:</h3> <span>${member.email}</span>
            </div>
            <div class="member-phone">
                <h3>phone:</h3> <span>${member.phone}</span>
            </div>
            <div class="member-msg">
                <h3>message:</h3> <div>${member.message}</div>
            </div>
          </div>
          `
        }).join("")}
      `
      
  
})


// the code below is for a responsive navbar on a mobile device or smaller screen
const openSidelinks = document.querySelector(".open-sidelinks")
const closeSidelinks = document.querySelector(".close-sidelinks")
const body = document.querySelector("body")

openSidelinks.addEventListener('click', (e) => {
  openSidelinks.classList.add("swap-out")
  closeSidelinks.classList.add("swap-in")
  const navLinks = document.querySelector(".nav-links")
  navLinks.classList.add("links-slide-in")
  body.classList.add("body")
 

  closeSidelinks.addEventListener("click", (e) => {
    openSidelinks.classList.remove("swap-out")
    closeSidelinks.classList.remove("swap-in")
    navLinks.classList.remove("links-slide-in")
    body.classList.remove("body")
  })
})
// the code above is for a responsive navbar on a mobile device


// the lines of code below determines actions that will result from clicking any of the nav-links
const nav = document.querySelector(".nav-links")
const navLinks = document.querySelectorAll(".nav-links > li")
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      closeSidelinks.classList.remove("swap-in")
      openSidelinks.classList.remove("swap-out")
      nav.classList.remove("links-slide-in")
      body.classList.remove("body")
  })
})

const topBody = document.querySelector(".main")
const membersBox = document.querySelector(".members")

navLinks[0].addEventListener("click", (e) => {
  topBody.classList.remove("off-screen")
  membersBox.classList.add("off-screen")
})

navLinks[1].addEventListener("click", (e) => {
  topBody.classList.add("off-screen")
  membersBox.classList.remove("off-screen")
})




// the variables declared below are used within the submit event listener
const form = document.querySelector("#form");
const name = document.querySelector(".name")
const occupation = document.querySelector(".occupation")
const address = document.querySelector(".address")
const tel = document.querySelector(".tel")
const email = document.querySelector(".email")
const officeAddress = document.querySelector(".office")
const message = document.querySelector(".text")

// error message div below:
const errMessages = document.querySelectorAll(".caution")

// all inputs
const allInputs = document.querySelectorAll("input")

let submitBtn = document.querySelector(".submit-btn")

// form loader onSubmit
let loader = document.querySelector(".loader")


form.addEventListener("submit", (e) => {
  e.preventDefault()


  // erase all error message upon every click of the submit button
  errMessages.forEach((message) => {
    message.textContent = ''
  })

  allInputs.forEach(input => {
    input.style.borderColor = `rgb(128, 125, 125)`
  })
  message.style.borderColor = `rgb(128, 125, 125)`

  
  // the lines of code below is for form validation

  let valid = true
  
    if(name.value === "" || name.value.length < 3 || /\d/.test(name.value)) {
      name.nextElementSibling.textContent = "name should contain at least 3 letters"
      valid = false;
      name.style.borderColor = "red";
    }

    if(occupation.value === "" || occupation.value.length < 3 || /\d/.test(name.value)) {
      occupation.nextElementSibling.textContent = "occupation should contain at least 3 letters"
      valid = false;
      occupation.style.borderColor = "red";
    }
  
    if(address.value.length < 3){
      address.nextElementSibling.textContent = "address should contain at least 3 characters"
      valid = false;
      address.style.borderColor = "red";
    }
  
    if(tel.value.length !== 11 || /^[a-zA-Z\s.,]+$/.test(tel.value)){
      tel.nextElementSibling.textContent = "phone number should be 11 digits only"
      valid = false;
      tel.style.borderColor = "red";
    }

    if(email.value.match(/^[a-zA-Z0-9.!#$%&*+//_{|}~]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/)) {
      email.nextElementSibling.textContent = ""
    } else {
      email.nextElementSibling.textContent = "invalid email"
      valid = false
      email.style.borderColor = "red"
    }
  
    
    if(officeAddress.value.length < 4){
      officeAddress.nextElementSibling.textContent = "address should contain at least 3 characters"
      valid = false;
      officeAddress.style.borderColor = "red";
    }
  
  
    if(message.value.length < 50 || message.value.length > 400|| /\d/.test(message.value)){
      message.nextElementSibling.textContent = "message should contain at least 50 but not more than 400 letters";
      message.style.borderColor = "red"
      valid = false;
    }



  // the lines of code above is for the form validaton

  if(valid){
      submitBtn.disabled = true
  }

  if(valid){
    loader.style.display = "block"
  }



    if(valid) {
      addDoc(colRef, {
        name: form.name.value,
        occupation: form.occupation.value,
        address: form.address.value,
        phone: form.tel.value,
        email: form.email.value,
        office: form.office.value,
        message: form.message.value
      })
      .then(() => {
        form.reset()
        enableBtn()
        removeLoader()
      })
      
    }
    
      
  
})

function enableBtn(){
  submitBtn.disabled = false
}

function removeLoader(){
  loader.style.display = "none"
}
