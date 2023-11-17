import Country from "./countryClass.js";


const countryName = localStorage.getItem("countryName");
const currentCountry = new Country(countryName);
let borderLinks = [];

// wait for the country to be loaded from http request
let timerCountry = setInterval(() => {
    if (currentCountry.isRequestEnded && currentCountry.isBordersEnded) {
        clearInterval(timerCountry);
        console.log(currentCountry);
        loadCountry();
    }
    else {
        const countryHolder = document.querySelector("#country_holder");
        countryHolder.innerHTML = `
        <div class="container">
        <h2 class="text-center mt-5 text-black">Sorry, this country does not exist</h2>
        </div>
        `;
    }
}, 50);

// after country loaded from http request, load the country page
const loadCountry = () => {
    console.log("country: ", currentCountry);
    const countryHolder = document.querySelector("#country_holder");
        //country loading
        countryHolder.innerHTML = currentCountry.render();
        //map loading
        const holder = document.querySelector(".map");
        currentCountry.drowMap(holder, currentCountry.latlng[0], currentCountry.latlng[1]);
        borderLinks = document.querySelectorAll(".border_link");
        borderLinkEvent();
}

// click border
const borderLinkEvent = () => {
    borderLinks.forEach(link => {
        link.addEventListener("click", () => {
            localStorage.setItem("countryName", link.id);
        });
    })
}
