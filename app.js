const wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoText = inputPart.querySelector(".info-text"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    wIcon = wrapper.querySelector(".weather-part img"),
    arrowBack = wrapper.querySelector("header i");

const apiKey = "fd8715bbd26c5f06ec357529266147e3";
let api;
inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else {
        alert("Your browser not support geolocation api");
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoText.innerText = error.message;
    infoText.classList.add("pending");
}


function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    fetchData();
}

function fetchData() {
    infoText.innerText = "Getting weather details...";
    infoText.classList.add("pending")
    fetch(api).then(data => data.json()).then(res => weatherDetails(res));
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoText.classList.replace("pending", "error");
        infoText.innerText = `${inputField.value} isn't a valid city name`;
    }
    else {
        const city = info.name;
        const country = info.sys.country;
        const { id, description } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        if (id == 800) {
            wIcon.src = "./Weather_Icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "./Weather_Icons/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "./Weather_Icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "./Weather_Icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "./Weather_Icons/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "./Weather_Icons/rain.svg";
        }


        wrapper.querySelector(".temp .numb").innerText = temp;
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = feels_like;
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;


        infoText.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
    inputField.value = "";
})
