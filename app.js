// 1 fetching the api for weather details
let target = "Belgaum";
const fetchWeatherDataByCountry = async (city) => {
  const key = `1d35dcc8063b4122ad764306233001`;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=7`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  return data;
};

fetchWeatherDataByCountry(target).then((weatherdata) => {
  getWeatherForecastUi(weatherdata);
  getWeatherDetails(weatherdata);
  renderWeekday(weatherdata.forecast.forecastday);
});

// 3 inserting values to display in the UI
function getWeatherForecastUi(data) {
  document.querySelector(".city").innerHTML = data.location.name;

  let fulldate = new Date(data.location.localtime).toLocaleString("en-us", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    hour12: false,
    minute: "numeric",
  });
  document.querySelector(".weather-datetime").innerHTML = fulldate;

  document.querySelector(
    ".weather-icon"
  ).innerHTML = ` <img src="http:${data.current.condition.icon}" alt=""> `;
  document.querySelector(".forecast").innerHTML = data.current.condition.text;
  document.querySelector(".temp").innerHTML =
    Math.round(data.current.temp_c) + "°C";
}
// getWeatherForecastUi --> call this function in fetchWeatherDataByCountry()

// 4 wind press humi inserting values
function getWeatherDetails(data) {
  document.querySelector(".feel").innerHTML =
    Math.round(data.current.feelslike_c) + "°C";
  document.querySelector(".humidity").innerHTML = data.current.humidity + "%";
  document.querySelector(".wind").innerHTML = data.current.wind_kph + "kph";
  document.querySelector(".pressure").innerHTML =
    data.current.pressure_mb + "mb";
}
// getWeatherDetails() --> call this function in fetchWeatherDataByCountry()

//  5  targeting the DOM elements to make an action
const searchInput = document.querySelector(".searchinput");
const dropdown = document.querySelector(".dropdown");
const dropdownText = document.querySelector("#dropdownText");
const weatherSearch = document.querySelector(".weather-search");
const searchBtn = document.querySelector(".searchbtn");

// 2 fetching particular cities from api,
// let cities = [];
const fetchWeatherDataByCities = async () => {
  const citiesUrl = `https://countriesnow.space/api/v0.1/countries/cities`;
  const response = await fetch(citiesUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country: "India" }),
  });
  const data = await response.json();
  cities = data.data;
  // console.log(cities);
  return cities;
};

fetchWeatherDataByCities().then((cities) => {
  renderCities(cities);
});

// 7 it displays the selected city in the searchinput.
function handeleDropDownclick(city) {
  searchInput.value = city;
  dropdown.style.display = "none";
}

// 6 creating div element for each city to display in the dropdown one by one
function renderCities(cities) {
  dropdown.innerHTML = "";

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    const listitem = document.createElement("div");
    listitem.textContent = city;

    listitem.addEventListener("click", () => handeleDropDownclick(city));

    dropdown.appendChild(listitem);
  }
}

// 8 filtering the cities
function filterCities() {
  const searchValue = searchInput.value.toLowerCase();
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().startsWith(searchValue)
  );
  renderCities(filteredCities);
}

// 9 search operation - displaying the selected city weather details on search button.
function searchButtonClick(e) {
  e.preventDefault();
  const selectedcity = searchInput.value;
  fetchWeatherDataByCountry(selectedcity).then((weatherdata) => {
    getWeatherForecastUi(weatherdata);
    getWeatherDetails(weatherdata);
    renderWeekday(weatherdata.forecast.forecastday);

    searchInput.value = "";
  });
}

// 10 creating an addeventlistener to perform events for diff actions
searchInput.addEventListener("input", filterCities);
searchBtn.addEventListener("click", searchButtonClick);
searchInput.addEventListener("focusin", () => {
  dropdown.style.display = "block";
});

// 11
function getWeekDayHtml(day, imgsrc, temperature) {
  return `<div class="card">
                <div class="Mon">${day}</div>
                <div class="icon"> <img src="${imgsrc}" alt="">
                </div>
                <div class="temperature">${Math.round(temperature)}&#176</div>
            </div>`;
}

// 12
function renderWeekday(forecastValue) {
  const render = document.querySelector(".fulldetails");
  render.innerHTML = "";
  console.log(forecastValue);
  forecastValue.forEach((forobject) => {
    const {
      date,
      day: {
        avgtemp_c,
        condition: { icon },
      },
    } = forobject; //Destructring

    const weekDay = getWeekDayFromDate(date); //14
    const setweekDayHtml = getWeekDayHtml(weekDay, icon, avgtemp_c);
    // console.log(setweekDayHtml);
    render.insertAdjacentHTML("beforeend", setweekDayHtml);
  });
}

// 13
function getWeekDayFromDate(date) {
  return new Date(date).toLocaleString("en-us", {
    weekday: "long",
  });
}

// 15 using geoloacion get weather details
function getGeoLocation() {
  navigator.geolocation.getCurrentPosition(success, error);
}

function success(latlong) {
  const lat = latlong.coords.latitude;
  const long = latlong.coords.longitude;
  console.log(latlong);
  // fetchWeatherDataByCountry(`${lat}, ${long}`).then((weatherdata) => {
  //   getWeatherForecastUi(weatherdata);
  //   getWeatherDetails(weatherdata);
  //   renderWeekday(weatherdata.forecast.forecastday);
  // });
  fetchAllFunction(`${lat}, ${long}`);
}

function error() {
  alert("failed");
  // fetchWeatherDataByCountry("goa").then((weatherdata) => {
  //   getWeatherForecastUi(weatherdata);
  //   getWeatherDetails(weatherdata);
  //   renderWeekday(weatherdata.forecast.forecastday);
  // });
  fetchAllFunction("goa");
}

function fetchAllFunction(query) {
  fetchWeatherDataByCountry(query).then((weatherdata) => {
    getWeatherForecastUi(weatherdata);
    getWeatherDetails(weatherdata);
    renderWeekday(weatherdata.forecast.forecastday);
  });
}

getGeoLocation();
