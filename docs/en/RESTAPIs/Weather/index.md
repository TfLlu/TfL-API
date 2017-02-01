{% extends "/docs.md" %}
{% block content %}
# GET Weather
Returns the current weather situation from [Luxembourg Airport](https://www.openstreetmap.org/way/389958279#map=12/49.5904/6.1740) in the [OpenWeathermap](https://openweathermap.org) format.

## Resource URL
    https://api.tfl.lu/v1/Weather

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
The [OpenWeathermap](https://openweathermap.org) API documentation can be found here: [https://openweathermap.org/current#current_JSON](https://openweathermap.org/current#current_JSON)


## Sample request & response
**GET** https://api.tfl.lu/v1/Weather
```json
{
	"coord": {
		"lat": 49.627688,
		"lon": 6.223234
	},
	"weather": [{
		"id": null,
		"main": null,
		"description": "Nuageux",
		"icon": null
	}],
	"base": null,
	"main": {
		"temp": 2,
		"pressure": 1015,
		"humidity": 86,
		"temp_min": null,
		"temp_max": null
	},
	"visibility": 8000,
	"wind": {
		"speed": 11,
		"deg": 360
	},
	"clouds": {
		"all": null
	},
	"dt": 1485869637,
	"sys": {
		"type": null,
		"id": null,
		"message": null,
		"country": null,
		"sunrise": null,
		"sunset": null
	},
	"id": null,
	"name": "Findel",
	"cod": 200
}
```

## License
Please refer to [Weather](/RESTAPIs/Weather.md#license) for information about the train and bus stop data licensing.
{% endblock %}
