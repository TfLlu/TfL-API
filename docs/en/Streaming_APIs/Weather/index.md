{% extends "/docs.md" %}
{% block content %}
# /Weather
Returns the current weather situation from [Luxembourg Airport](https://www.openstreetmap.org/way/389958279#map=12/49.5904/6.1740) in the [OpenWeathermap](https://openweathermap.org) format and sends you updates as they are processed by our engine.

## Resource URL
    /Weather

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
The [OpenWeathermap](https://openweathermap.org) API documentation can be found here: [https://openweathermap.org/current#current_JSON](https://openweathermap.org/current#current_JSON)


## Sample request & response
/Weather
```json
{
	"type": "new",
	"data": {
		"coord": {
			"lat": 49.627688,
			"lon": 6.223234
		},
		"weather": [{
			"id": null,
			"main": null,
			"description": "Faible averse de pluie",
			"icon": null
		}],
		"base": null,
		"main": {
			"temp": 6,
			"pressure": 1026,
			"humidity": 93,
			"temp_min": null,
			"temp_max": null
		},
		"visibility": 10000,
		"wind": {
			"speed": 19,
			"deg": 270
		},
		"clouds": {
			"all": null
		},
		"dt": 1487342675,
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
}
```

## License
Please refer to [Weather](/Streaming_APIs/Weather.md#license) for information about the weather data licensing.
{% endblock %}
