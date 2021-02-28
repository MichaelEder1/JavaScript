window.onload = function ()
{
    let long;
    let lat;
    const lang = navigator.language.split("-");

    let temperatureDescription = document.querySelector(".temperature-description");
    let temperatureDegree = document.querySelector(".temperature-degree");
    let locationTimeZone = document.querySelector(".location-timezone");
    let locationIcon = document.querySelector(".location-icon");
    let temperatureSection = document.querySelector(".temperature");
    let temperatureSpan = document.querySelector(".temperature span");

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(position =>
        {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=4990cb70e423cc819ff3d3ba62743fac&lang=${lang[0]}`;
            fetch(api)
                .then(data =>
                {
                    return data.json();
                })
                .then(data =>
                {
                    const temperature = data.main.temp;
                    const summary = data.weather[0].description;
                    const icon = data.weather[0].icon;

                    let fahrenheit = Math.round(temperature * 1.80000000 + 32);
                    console.log(fahrenheit);
                    //Set DOM Elements from API Call
                    temperatureDegree.textContent = temperature;
                    temperatureDescription.textContent = summary;
                    locationTimeZone.textContent = data.name;

                    setIcon(icon);

                    //change Temperature to Fahrenheit/Celsius
                    temperatureSection.onclick = function ()
                    {
                        if (temperatureSpan.textContent === "F")
                        {
                            temperatureSpan.textContent = "C";
                            temperatureDegree.textContent = temperature;
                        }
                        else
                        {
                            temperatureSpan.textContent = "F";
                            temperatureDegree.textContent = fahrenheit;
                        }
                    }
                });
        });

    }
    else
    {
        document.querySelector("#location-timezone").textContent = "Geolocation must be allowed"
    }

    function setIcon(iconID)
    {
        locationIcon.src = `http://openweathermap.org/img/wn/${iconID}@2x.png`;
    }
}