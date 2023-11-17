class Country {

    constructor(_name) {
        this.name = _name;
        this.isRequestEnded = false;
        this.isRequestSucceeded = false;
        this.isBordersEnded = false;
        this.borders = [];

        this.url = `https://restcountries.com/v3.1/name/${this.name}?fields=altSpellings,borders,capital,flags,languages,name,population,borders,region,latlng`;
        this.getCountryInfo()
            .then(data => {
                if (data != -1) {
                    this.name = data[0].name.common;
                    this.population = data[0].population;
                    this.capital = data[0].capital;
                    this.flag = data[0].flags.png;
                    this.language = data[0].languages;
                    this.region = data[0].region;
                    this.latlng = data[0].latlng;
                    this.isRequestSucceeded = true;
                    this.setBorders(data[0].borders);
                }
                this.isRequestEnded = true;
            })
    }

    // connect to API and return the country data or -1 if not found
    async getCountryInfo() {
        let response = await fetch(this.url);
        let data = await response.json();
        if (response.status == 200) {
            return data;
        } else {
            return -1;
        }
    }

    getLanguage() {
        return Object.values(this.language);
    }

    setBorders(_bordersList) {
        console.log("blist: ", _bordersList);
        if (_bordersList.length != 0) { // if there are borders
            console.log("entered");
            const bordersUrl = `https://restcountries.com/v3.1/alpha?codes=${_bordersList}`;
            let nameBorders = [];
            fetch(bordersUrl)
                .then((res) => res.json())
                .then((data) => {
                    nameBorders = data.map((x) => x.name.common);
                    this.borders = nameBorders;
                    this.isBordersEnded = true;
                })
                .catch((err) => console.log(err));
        }
        else {
            this.isBordersEnded = true;
        }
    }

    getBorders() {
        let borderLinks = [];
        this.borders.forEach(border => {
            let element = `<a href="display_country.html" id="${border}" class="border_link me-1">${border}</a>`;
            borderLinks.push(element);
        })
        return borderLinks;
    }

    drowMap(holder, lat, lon) {
        const mapEl = document.createElement("div");
        holder.innerHTML = ``;
        holder.append(mapEl);
        mapEl.id = `chipopo${Date.now()}`;
        mapEl.className = "map";
        const map = L.map(mapEl.id).setView([`${lat}`, `${lon}`], 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 6,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
    }

    render() {
        return `
        <div class="map w-100 w-md-75">
        </div>
        <div id="country_details">
            <h1 class="text-center m-3">${this.name}</h1>
            <div class="d-flex flex-column justify-content-start align-items-center px-3 px-lg-5 mt-5">
                <img src="${this.flag}" width="100%" height="200px" class="mb-5">
                <article class="w-100 d-flex flex-column">
                    <p class="mb-2"><strong class="me-3">Region: </strong>${this.region}</p>

                    <p class="mb-2"><strong class="me-3">Capital: </strong>${this.capital}</p>

                    <p class="mb-2"><strong class="me-3">Language: </strong>${this.getLanguage()}</p>

                    <p class="mb-2"><strong class="me-3">Population: </strong>${this.population}</p>

                    <p><strong class="me-3">Borders: </strong>${this.getBorders()}</p>

                </article>
            </div>
            
            </div>
        `;
    }
}

export default Country;