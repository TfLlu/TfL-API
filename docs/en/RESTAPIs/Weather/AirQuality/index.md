{% extends "/docs.md" %}
{% block content %}
# GET Weather/Airquality
Returns the current air quality data from various locations in Luxembourg collected by [Administration de l'Environnement](http://www.environnement.public.lu/).

## Resource URL
    https://api.tfl.lu/v1/Weather/Airquality

## Format
The response will be formatted as a [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) [Feature Collection](http://geojson.org/geojson-spec.html#feature-collection-objects).

## Object properties
| Key             | Type      | Possible values                    | Description                                                                                                          |
| --------------- | --------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **id**          | `string`  | <nobr>`{provider}:{number}`</nobr> | id of the weather station (built from provider and id of provider)                                                   |
| **name**        | `string`  | `{name}`                           | name of the weather station                                                                                          |
| **temp**        | `float`   | - `{temp}`<br />- `NULL`           | temperature in Celsius                                                                                               |
| **pm10**        | `float`   | - `{pm10}`<br />- `NULL`           | [Particles](https://en.wikipedia.org/wiki/Particulates) on the order of 10 micrometers or less (in µg/m<sup>3</sup>) |
| **no2**         | `float`   | - `{no2}`<br />- `NULL`            | [Nitrogen dioxide](https://en.wikipedia.org/wiki/Nitrogen_dioxide) (in µg/m<sup>3</sup>)                             |
| **o3**          | `float`   | - `{o3}`<br />- `NULL`             | [Ozone](https://en.wikipedia.org/wiki/Ozone)  (in µg/m<sup>3</sup>)                                                  |
| **so2**         | `float`   | - `{so2}`<br />- `NULL`            | [Sulfur dioxide](https://en.wikipedia.org/wiki/Sulfur_dioxide) (in µg/m<sup>3</sup>)                                 |
| **co**          | `float`   | - `{co}`<br />- `NULL`             | [Carbon monoxide](https://en.wikipedia.org/wiki/Carbon_monoxide) (in mg/m<sup>3</sup>)                               |
| **last_update** | `integer` | `{last_update}`                    | last update of the data in [Unix time](https://en.wikipedia.org/wiki/Unix_time) (milliseconds)                       |


## Sample request & response
**GET** https://api.tfl.lu/v1/Weather/Airquality
```json
{
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [
					5.976941,
					49.505011
				]
			},
			"properties": {
				"id": "aev:Esch-Alzette",
				"name": "Esch-Alzette",
				"temp": 5.5,
				"pm10": 52,
				"no2": 24.8,
				"o3": 41,
				"so2": 1.2,
				"co": 0.3,
				"last_update": "1486998000000"
			}
		},
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [
					6.305332,
					49.722229
				]
			},
			"properties": {
				"id": "aev:Beidweiler",
				"name": "Beidweiler",
				"temp": 4.1,
				"pm10": 27,
				"no2": 11,
				"o3": 64,
				"so2": 2.9,
				"co": null,
				"last_update": "1486998000000"
			}
		}, {
            ...
        }]
}
```

## License
Please refer to [Weather/AirQuality](/RESTAPIs/Weather.md#license) for information about the air quality data licensing.
{% endblock %}
