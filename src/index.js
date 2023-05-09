let geo =[]
// let WeatherObj

document.addEventListener('DOMContentLoaded',()=>{

   ListCitys()
   getCity()
    // renderWeather(WeatherObj)
//    console.log(getstr)
//    document.querySelector('#Display_state').innerText= `we get state ${getstr}`
})

// let gridX=11, gridY=12,startTime,endTime


function getCity(){
    const selectCity = document.querySelector('#citys_name')
    let city
    const state= 'CA'
    selectCity.addEventListener('change',(event)=>{
        event.preventDefault()
        city = event.target.value
        // return value
    document.querySelector('#Display_city').innerText= `the city is ${event.target.value}  `  
    // document.querySelector('#city_collection').appendChild(city)
    getCityLocation(city,state)
    })
    console.log(city)
    
}
async function getCityLocation(city,state){
    const API_key = ''
    try{
        const getres = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city},+${state}&key=${API_key}`)
        const geoData = await getres.json()
        let lat = geoData.results[0].geometry.location.lat;
        let lng = geoData.results[0].geometry.location.lng

        const res = await fetch(`https://api.weather.gov/points/${lat},${lng}`)
        let e = await res.json()
        let weatherUrl = `https://api.weather.gov/gridpoints/${e.properties.gridId}/${e.properties.gridX},${e.properties.gridY}/forecast/hourly`
        const response = await fetch(weatherUrl)
        let data = await response.json()
        console.log(data.properties.periods)
        let index = data.properties.periods.findIndex(findIndex)

        WeatherObj = data.properties.periods[index]
        console.log(WeatherObj.shortForecast)
        renderWeather(WeatherObj,city)
    //    getWeather(geo[0],geo[1])
    }catch(error){
        console.error('fetch city data error:',error)
    }
    
}

function findIndex(element){
    let curtime = new Date()
    let StartDate = new Date(element.startTime);
    let EndDate = new Date(element.endTime);
    let localStartTime = new Date(StartDate.toLocaleString('en-US',{timeZone:'America/Los_Angeles'}))
    let localEndTime = new Date(EndDate.toLocaleString('en-US',{timeZone:'America/Los_Angeles'}))
    console.log("local time: " + curtime +"start time:" + localStartTime+'end time'+ localEndTime)
    if(curtime >= localStartTime && curtime <= localEndTime){
        return true
    }else{
        return false
    }
}



function ListCitys(){

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
    
    let CitysOption =[] 
    let i=0
    const cityName = document.querySelector('#citys_name')
    cities.forEach(city=>{
        CitysOption[i]=document.createElement('option')
        CitysOption[i].value = city
        CitysOption[i].innerText= city
        cityName.appendChild(CitysOption[i])
        i++
    })
    

}

let forecastPhoto

function renderWeather(cityWeatherObj, city){
    const cityCard = document.createElement('div');
    switch(cityWeatherObj.shortForecast){
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
            if (cityWeatherObj.isDaytime){
                forecastPhoto = './assets/cloudy-day-2.svg'
            }else{
                forecastPhoto = './assets/cloudy-night-2.svg'
            }
            
            break;
        case 'Mostly Cloudy':
            if (cityWeatherObj.isDaytime){
                forecastPhoto = './assets/cloudy-day-3.svg'
            }else{
                forecastPhoto = './assets/cloudy-night-3.svg'
            }
            break;
        case 'Cloudy':
            if (cityWeatherObj.isDaytime){
                forecastPhoto = './assets/cloudy.svg'
            }else{
                forecastPhoto = './assets/cloudy.svg'
            }
            break;
        case 'Mostly Clear':
            forecastPhoto = './assets/cloud-night-1.svg'
            break
        case 'Clear':
            forecastPhoto = './assets/night.svg'
            break;
        case 'Patchy Drizzle':
            if (cityWeatherObj.isDaytime){
                forecastPhoto = './assets/cloud-day-3.svg'
            }else{
                forecastPhoto = './assets/cloud-night-3.svg'
            }
            break;
    }
    cityCard.className = 'citycard';
    cityCard.innerHTML=`
        
        
        <div class="degrees"><img src = ${forecastPhoto} class = 'forecastphoto'  >${cityWeatherObj.temperature}&deg${cityWeatherObj.temperatureUnit}</div>
        <div class="place">${city}</div>
        <div class="weather">${cityWeatherObj.shortForecast}</div>
        <div class="wind">Wind: ${cityWeatherObj.windSpeed} | Direction: ${cityWeatherObj.windDirection}</div>
        <div class="humidity">Humidity: ${cityWeatherObj.relativeHumidity.value}% </div>
        <div class=""
        `
    document.querySelector("#city_collection").appendChild(cityCard)
}