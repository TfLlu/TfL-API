{% extends "/docs.md" %}
{% block content %}
# /Highway/{ID}
Returns the current highway data from a single highway collected by [CITA](http://cita.lu/) and sends you updates as they are processed by our engine.

## Parameters
| Parameter         | Example value                   | Description |
| ----------------- | ------------------------------- | ----------- |
| **id** | `cita:A4` | Id `string` of highway as found in [`GET /Highway`](/RESTAPIs/Highway/index.md) |

## Resource URL
    /Highway/{ID}

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
/Highway/cita:A4
```json
{
	"type": "new",
	"data": [{
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
	}]
}
```

## License
Please refer to [Weather/AirQuality](/Streaming_APIs/Weather.md#license) for information about the air quality data licensing.
{% endblock %}
