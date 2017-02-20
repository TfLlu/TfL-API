{% extends "/docs.md" %}
{% block content %}
# GET Weather/Airquality/{ID}
Returns the current air quality data from a single location collected by [Administration de l'Environnement](http://www.environnement.public.lu/).

## Parameters
| Parameter | Example value       | Description |
| --------- | --------------------| ----------- |
| **id**    | `aev:Lux-Bonnevoie` | Id `integer` of weather station as found in [`GET /Weather/AirQuality`](/RESTAPIs/Weather/AirQuality/index.md) |

## Resource URL
    https://api.tfl.lu/v1/Weather/Airquality/{ID}

## Format
The response will be formatted as a [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) [Feature](http://geojson.org/geojson-spec.html#feature-objects).

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
**GET** https://api.tfl.lu/v1/Weather/Airquality/aev:Lux-Bonnevoie
```json
{
	"type": "Feature",
	"geometry": {
		"type": "Point",
		"coordinates": [
			6.137603,
			49.597692
		]
	},
	"properties": {
		"id": "aev:Lux-Bonnevoie",
		"name": "Lux-Bonnevoie",
		"temp": null,
		"pm10": 40,
		"no2": 43,
		"o3": 29,
		"so2": 2.4,
		"co": 0.4,
		"last_update": "1487001600000"
	}
}
```

## License
Please refer to [Weather/AirQuality](/RESTAPIs/Weather.md#license) for information about the air quality data licensing.
{% endblock %}
