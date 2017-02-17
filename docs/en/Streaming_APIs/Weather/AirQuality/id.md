{% extends "/docs.md" %}
{% block content %}
# /Weather/Airquality/{ID}
Returns the current air quality data from a single location collected by [Administration de l'Environnement](http://www.environnement.public.lu/) and sends you updates as they are processed by our engine.

## Parameters
| Parameter | Example value       | Description |
| --------- | --------------------| ----------- |
| **id**    | `aev:Lux-Bonnevoie` | Id `integer` of weather station as found in [`GET /Weather/AirQuality`](/RESTAPIs/Weather/AirQuality/index.md) |

## Resource URL
    /Weather/Airquality/{ID}

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


## Sample channels & response
/Weather/Airquality/aev:Esch-Alzette
```json
{
	"type": "new",
	"data": [{
		"id": "aev:Esch-Alzette",
		"data": {
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [5.976941, 49.505011]
			},
			"properties": {
				"id": "aev:Esch-Alzette",
				"name": "Esch-Alzette",
				"temp": 8.5,
				"pm10": 15,
				"no2": 12.9,
				"o3": 54,
				"so2": 1.2,
				"co": 0.2,
				"last_update": "1487340000000"
			}
		}
	}]
}
```

## License
Please refer to [Weather/AirQuality](/Streaming_APIs/Weather.md#license) for information about the air quality data licensing.
{% endblock %}
