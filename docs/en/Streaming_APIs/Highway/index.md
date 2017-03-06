{% extends "/docs.md" %}
{% block content %}
# /Highway
Returns the current highway data collected by [CITA](http://cita.lu/) and sends you updates as they are processed by our engine.

## Resource URL
    /Highway

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
| Key                           | Type       | Possible values | Description |
| ------------                  | ---------  | --------------- | ----------- |
| **id**                        | `integer`  | `{id}`          | id of bus and/or train stop |
| **transitTimes**              | `array`    | `{name}`        | name of bus and/or train stop (used for search) |
| **transitTimes.origin**       | `string`   | `{origin}`        | name of bus and/or train stop (used for search) |
| **transitTimes.destinations** | `object`   | `{destinations}`        | name of bus and/or train stop (used for search) |

## Destination property
| Key                           | Type       | Possible values | Description |
| ------------                  | ---------  | --------------- | ----------- |
| **key**                       | `strint`   | `{destination}` | destination |
| **value**                     | `integer`  | - `{transitTime}`<br />- `NULL` | transit time in seconds |


## Sample channel & response
/Highway
```json
{
	"type": "new",
	"data": [{
		"id": "cita:A13",
		"data": {
			"id": "cita:A13",
			"transitTimes": [{
				"origin": "schengen",
				"destinations": {
					"lux-sud": 1140,
					"lux-est": 1380,
					"belgique": 2100
				}
			}]
		}
	}, {
		"id": "cita:A4",
		"data": {
			"id": "cita:A4",
			"transitTimes": [{
				"origin": "lallange",
				"destinations": {
					"lux-hol": 540,
					"lux-sud": 600,
					"lux-est": 900
				}
			}, {
				"origin": "merl",
				"destinations": {
					"foetz": 840,
					"raemerich": 1140
				}
			}]
		}
	}, {
		"id": "cita:A3",
		"data": {
			"id": "cita:A3",
			"transitTimes": [{
				"origin": "lux-sud",
				"destinations": {
					"france": 780
				}
			}, {
				"origin": "france",
				"destinations": {
					"lux-sud": 480,
					"lux-est": 780,
					"belgique": 1440
				}
			}]
		}
	}, {
        ...
    }]
}
```

## License
Please refer to [Weather/AirQuality](/Streaming_APIs/Weather.md#license) for information about the air quality data licensing.
{% endblock %}
