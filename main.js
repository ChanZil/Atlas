import Country from "./countryClass.js";

const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".search_btn");
let carouselInnerHolder = document.querySelector("#carousel_holder");
const displayCountries = ["Israel", "Thailand", "Italy", "France", "USA"];
let numRequst = 0;
let isFirstSlide = true;
let countriesInDisplay = [];

// nav bar buttons
const israelBtn = document.querySelectorAll(".israel_btn");
const usaBtn = document.querySelectorAll(".usa_btn");
const italyBtn = document.querySelectorAll(".italy_btn");
const franceBtn = document.querySelectorAll(".france_btn");
const thailandBtn = document.querySelectorAll(".thailand_btn");

// creates an array with the details of the countries to display
const displayCarouselCountries = () => {
    let carouselCountries = [];
    displayCountries.forEach(element => {
        getCountriesDetails(element)
        .then(data => {
            if(data != -1) {
                let current = {
                    "name": data[0].name.common,
                    "flag": data[0].flags.png
                };
                carouselCountries.push(current);
            }
            numRequst++;
        });
    })

    let timer = setInterval(() => {
        if (numRequst == displayCountries.length) {
            clearInterval(timer);
            createCountriesCarousel(carouselCountries);
        }
    }, 50);
}

async function getCountriesDetails(_currentCountryName) {
    let url = `https://restcountries.com/v3.1/name/${_currentCountryName}?fields=name,flags`;
    let response = await fetch(url);
    let data = await response.json();
    if (response.status == 200) {
        return data;
    } else {
        return -1;
    }
}

// create the carousel of the countries
const createCountriesCarousel = (_carouselCountries) => {
    let numCountriesInSlide = 3;
    if(window.matchMedia("(max-width: 767px)").matches) {
        numCountriesInSlide = 2;
    }
    if(window.matchMedia("(max-width: 576px)").matches) {
        numCountriesInSlide = 1;
    }
    let counter = 0;
    let slideCountries = [];

    _carouselCountries.forEach(element => {
        slideCountries.push(element);
        counter++;
        if(counter == numCountriesInSlide) {
            carouselInnerHolder.append(createCountriesSlide(slideCountries));
            slideCountries = [];
            counter = 0;
        }
    })
    // if finished and the last card contains less then numCountriesInSlide
    if(counter < numCountriesInSlide) { 
        carouselInnerHolder.append(createCountriesSlide(slideCountries));
    }
    countriesInDisplay = document.querySelectorAll(".country_card");
    console.log("countries: ", countriesInDisplay);
    countryInDisplayClicked();
}

// create 1 slide of the carousel of countries
const createCountriesSlide = (_countries) => {
    const slide = document.createElement("div");
    slide.className = "carousel-item";
    if (isFirstSlide) {
        slide.className = "carousel-item active";
        isFirstSlide = false;
    }
    const slideDiv = document.createElement("div");
    slideDiv.className = "countries_holder row justify-content-center"
    _countries.forEach(element => {
        slideDiv.innerHTML += createCountryCard(element.name, element.flag);
    });
    slide.append(slideDiv);
    console.log("slide: ", slide);
    return slide;
}

// create 1 card of a country - contain name and flag
const createCountryCard = (_countryName, _countryFlag) => {
    return `
    <a href="display_country.html" class="country_card col-10 col-sm-5 col-md-3 mx-2 my-4" id="${_countryName}">
        <h4 class="text-black text-center mt-2 mb-0">${_countryName}</h4>
        <img src=${_countryFlag} width="100%" height="150px">
    </a>
    `;
}


const countryInDisplayClicked = () => {
    countriesInDisplay.forEach(element => {
        element.addEventListener("click", () => {
            localStorage.setItem("countryName", element.id);
        });
    });
}

displayCarouselCountries();

searchBtn.addEventListener("click", () => {
    localStorage.setItem("countryName", searchInput.value);
});

// nav bar events
israelBtn.forEach(element => {
    element.addEventListener("click", () => {
        localStorage.setItem("countryName", "Israel");
    });
});

usaBtn.forEach(element => {
    element.addEventListener("click", () => {
        localStorage.setItem("countryName", "USA");
    });
});

italyBtn.forEach(element => {
    element.addEventListener("click", () => {
        localStorage.setItem("countryName", "Italy");
    });
});

franceBtn.forEach(element => {
    element.addEventListener("click", () => {
        localStorage.setItem("countryName", "France");
    });
});

thailandBtn.forEach(element => {
    element.addEventListener("click", () => {
        localStorage.setItem("countryName", "Thailand");
    });
});
