let geo = []
// let WeatherObj
let weatherObj = {
    city: "",
    image: "",
    shortForecast: "",
    windSpeed: "",
    windDirection: "",
    temperature: "",
    humidity: "",
    gridId: "",
    gridX: 0,
    gridY: 0,
    idName: "",
    count: 0
}
document.addEventListener('DOMContentLoaded', () => {
    showCards()
    ListCitys()
    getCity()
    setInterval(callFunc,300000)
   
})




function getCity() {
    const selectCity = document.querySelector('#citys_name')
    let city

    selectCity.addEventListener('change', (event) => {
        event.preventDefault()
        city = event.target.value
        // return value
        document.querySelector('#Display_city').innerText = `the city is ${event.target.value}  `
        // document.querySelector('#city_collection').appendChild(city)
        getCityLocation(city)
    })

}
async function getCityLocation(city) {
    const state = 'CA'
    const API_key = ''
    try {
        const getres = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city},+${state}&key=${API_key}`)
        const geoData = await getres.json()
        let lat = geoData.results[0].geometry.location.lat;
        let lng = geoData.results[0].geometry.location.lng

        const res = await fetch(`https://api.weather.gov/points/${lat},${lng}`)
        let e = await res.json()
        // console.log(e)
        let weatherUrl = `https://api.weather.gov/gridpoints/${e.properties.gridId}/${e.properties.gridX},${e.properties.gridY}/forecast/hourly`
        const response = await fetch(weatherUrl)
        let data = await response.json()
        let index = data.properties.periods.findIndex(findIndex)

        let WeatherObj = data.properties.periods[index]
        console.log(WeatherObj.shortForecast)
        CreaterenderWeather(WeatherObj, city, e.properties.gridId, e.properties.gridX, e.properties.gridY)

    } catch (error) {
        console.error('fetch city data error:', error)
    }

}

function findIndex(element) {
    let curtime = new Date()
    let StartDate = new Date(element.startTime);
    let EndDate = new Date(element.endTime);
    let localStartTime = new Date(StartDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
    let localEndTime = new Date(EndDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
    // console.log("local time: " + curtime +"start time:" + localStartTime+'end time'+ localEndTime)
    if (curtime >= localStartTime && curtime <= localEndTime) {
        return true
    } else {
        return false
    }
}



function ListCitys() {

    // StatesArray = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
    cities = [
        "Los Angeles",
        "San Diego",
        "San Jose",
        "San Francisco",
        "Daly City",
        "San Mateo",
        "Newark",
        "San Leandro",
        "Tracy",
        "Hayward",
        "Fresno",
        "Sacramento",
        "Long Beach",
        "Oakland",
        "Bakersfield",
        "Anaheim",
        "Santa Ana",
        "Riverside",
        "Stockton",
        "Chula Vista",
        "Irvine",
        "Fremont",
        "San Bernardino",
        "Modesto",
        "Berkeley",
        "Richmond",
        "Fontana",
        "Oxnard",
        "Moreno Valley",
        "Huntington Beach",
        "Glendale",
        "Santa Clarita",
        "Garden Grove",
        "Oceanside",
        "Rancho Cucamonga",
        "Santa Rosa",
        "Santa Cruz",
        "Ontario",
        "Elk Grove"
    ]

    let CitysOption = []
    let i = 0
    const cityName = document.querySelector('#citys_name')
    cities.forEach(city => {
        CitysOption[i] = document.createElement('option')
        CitysOption[i].value = city
        CitysOption[i].innerText = city
        cityName.appendChild(CitysOption[i])
        i++
    })


}


function getphoto(shortForecast, isDaytime) {
    let forecastPhoto
    switch (shortForecast) {
        case 'Sunny':
            forecastPhoto = './assets/day.svg'
            break;
        case 'Mostly Sunny':
            forecastPhoto = './assets/cloudy-day-1.svg'
            break;
        case 'Partly Sunny':
            forecastPhoto = './assets/cloudy-day-2.svg'
            break;
        case 'Partly Cloudy':
            if (isDaytime) {
                forecastPhoto = './assets/cloudy-day-2.svg'
            } else {
                forecastPhoto = './assets/cloudy-night-2.svg'
            }
            break;
        case 'Mostly Cloudy':
            if (isDaytime) {
                forecastPhoto = './assets/cloudy-day-3.svg'
            } else {
                forecastPhoto = './assets/cloudy-night-3.svg'
            }
            break;
        case 'Cloudy':
            if (cityWeatherObj.isDaytime) {
                forecastPhoto = './assets/cloudy.svg'
            } else {
                forecastPhoto = './assets/cloudy.svg'
            }
            break;
        case 'Mostly Clear':
            forecastPhoto = './assets/cloudy-night-1.svg'
            break
        case 'Clear':
            forecastPhoto = './assets/night.svg'
            break;
        case 'Patchy Drizzle':
            if (isDaytime) {
                forecastPhoto = './assets/cloud-day-3.svg'
            } else {
                forecastPhoto = './assets/cloud-night-3.svg'
            }
            break;
        case 'Slight Chance Light Rain':
            if (isDaytime) {
                forecastPhoto = './assets/rainy-2.svg'
            } else {
                forecastPhoto = './assets/rainy-4.svg'
            }
            break;
        case 'Rain Showers':
            forecastPhoto = './assets/rainy-7.svg'
            break;
        case 'Thunderstorms':
            forecastPhoto = './assets/thunder.svg'
            break;
    }
    return forecastPhoto
}

async function CreaterenderWeather(cityWeatherObj, cityName, GridId, GridX, GridY) {

    let forecastPhoto = getphoto(cityWeatherObj.shortForecast, cityWeatherObj.isDaytime)
    console.log(forecastPhoto)
    let HaveItem = false
    let getItem = null
    try {
        const res = await fetch("http://localhost:3000/weatherCards")
        let data = await res.json()
        getItem = data.find(function (item) {
            return item.city === cityName
        })
        if (getItem) {
            HaveItem = true
        }

        // console.log(HaveItem)
        // console.log(getItem)
    } catch (error) {
        console.log(error.message)
    }
    weatherObj = {
        city: cityName,
        image: forecastPhoto,
        shortForecast: cityWeatherObj.shortForecast,
        windSpeed: cityWeatherObj.windSpeed,
        windDirection: cityWeatherObj.windDirection,
        temperature: cityWeatherObj.temperature,
        humidity: cityWeatherObj.relativeHumidity.value,
        gridId: GridId,
        gridX: GridX,
        gridY: GridY,
        count: 1,
    }

    if (HaveItem) {
        updateWeatherCard(getItem)
    } else {
        renderWeather(weatherObj)
        addWeatherCard(weatherObj)

    }

}



function renderWeather(weatherObj) {
    const cityCard = document.createElement('div');
    cityCard.className = 'citycard';
    let unit = 'F'
    let idName = weatherObj.city
    idName = idName.replace(" ", '_')
    weatherObj.idName = idName
    console.log(idName)
    cityCard.innerHTML = `
        <div id=${idName}>
        <div class="degrees"><img src = ${weatherObj.image} class = 'forecastphoto'  >${weatherObj.temperature}&deg${unit}</div>
        <div class="place">${weatherObj.city}</div>
        <div class="weather">${weatherObj.shortForecast}</div>
        <div class="wind">Wind: ${weatherObj.windSpeed} | Direction: ${weatherObj.windDirection}</div>
        <div class="humidity">Humidity: ${weatherObj.humidity}% </div>
        <div class="count">the count is: ${weatherObj.count}</div>
        </div>
        <button id="clean" class="clean">x</button>
        `

    document.querySelector("#city_collection").appendChild(cityCard)
}


function addWeatherCard(WeatherObj) {
    fetch("http://localhost:3000/weatherCards", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(WeatherObj)
    })
        .then(res => res.json)
        .then(item => console.log(item))
        .catch(error => console.log(error.message))

}

async function updateWeatherCard(WeatherObj) {
    fetch(`http://localhost:3000/weatherCards/${WeatherObj.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(WeatherObj)
    })

}

async function showCards() {
    try {
        const res = await fetch("http://localhost:3000/weatherCards")
        let weatherCards = await res.json()
        // console.log(weatherCards)
        weatherCards.forEach(card => renderWeather(card))
    } catch (error) {
        console.log(error.message)
    }

}

async function UpdateddataBase(weatherObj) {
    let weatherUrl = `https://api.weather.gov/gridpoints/${weatherObj.gridId}/${weatherObj.gridX},${weatherObj.gridY}/forecast/hourly`
    const response = await fetch(weatherUrl)
    let data = await response.json()
    console.log(weatherObj.city)
    // console.log(data.properties.periods)
    let index = data.properties.periods.findIndex(findIndex)

    let WeatherElement = data.properties.periods[index]
    console.log(WeatherElement)
    console.log('ShortForecast',WeatherElement.shortForecast)
    let forecastPhoto = getphoto(WeatherElement.shortForecast, WeatherElement.isDaytime)
    weatherObj.image = forecastPhoto
    weatherObj.shortForecast = WeatherElement.shortForecast
    weatherObj.windSpeed = WeatherElement.windSpeed
    weatherObj.windDirection = WeatherElement.windDirection
    weatherObj.temperature = WeatherElement.temperature
    weatherObj.humidity = WeatherElement.relativeHumidity.value
    weatherObj.count++
    console.log(WeatherElement.shortForecast)
    let unit = 'F'
    let element = document.querySelector(`#${weatherObj.idName}`)
    console.log('element id: ' + element.id)

    const degree = element.querySelector(".degrees")
    // const place = element.querySelector(".place")
    const weather = element.querySelector(".weather")
    const wind = element.querySelector(".wind")
    const humidity = element.querySelector(".humidity")
    const count = element.querySelector(".count")

    degree.innerHTML = `<img src = ${forecastPhoto} class = 'forecastphoto'  >${WeatherElement.temperature}&deg${unit}`
    weather.textContent = `${WeatherElement.shortForecast}`
    wind.textContent = `Wind: ${WeatherElement.windSpeed} | Direction: ${WeatherElement.windDirection}`
    humidity.textContent = `Humidity: ${WeatherElement.relativeHumidity.value}% `
    count.innerHTML = `the count is ${weatherObj.count}`
    // console.log('count:', count.textContent)
    // console.log('The weatherObj count: ' + WeatherElement.count)


    updateWeatherCard(weatherObj)

}

async function updateCard() {
    try {
        const res = await fetch("http://localhost:3000/weatherCards")
        let weatherCards = await res.json()
        console.log(weatherCards)
        weatherCards.forEach(card => UpdateBase(card))
    } catch (error) {
        console.log(error.message)
    }
}


async function updateCityWeatherObj() {

    try {
        const res = await fetch("http://localhost:3000/weatherCards")
        let weatherCards = await res.json()
        console.log(weatherCards)
        weatherCards.forEach(weatherObj => updateCityWeather(weatherObj))
    } catch (error) {
        console.log(error.message)
    }

}




async function callFunc() {
    updateCityWeatherObj()
    try {
        const res = await fetch("http://localhost:3000/weatherCards")
        let weatherCards = await res.json()
        console.log('before updated database: ', weatherCards)
        weatherCards.forEach(card => UpdateddataBase(card))
    } catch (error) {
        console.log(error.message)

    }
}