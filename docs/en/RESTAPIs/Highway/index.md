{% extends "/docs.md" %}
{% block content %}
# GET Highway
Returns all highway information integrated in Transport for Luxembourg.

## Resource URL
    https://api.tfl.lu/v1/Highway

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


## Sample request & response
**GET** https://api.tfl.lu/v1/Highway
```json
[{
	"id": "cita:A13",
	"transitTimes": [{
		"origin": "schengen",
		"destinations": {
			"lux-sud": 1080,
			"lux-est": 1380,
			"belgique": 2100
		}
	}]
}, {
	"id": "cita:A4",
	"transitTimes": [{
		"origin": "lallange",
		"destinations": {
			"lux-hol": 540,
			"lux-sud": 600,
			"lux-est": 840
		}
	}, {
		"origin": "merl",
		"destinations": {
			"foetz": 660,
			"raemerich": 1020
		}
	}]
}, {
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
			"belgique": 1320
		}
	}]
}, {
    ...
}]
```

## License
Please refer to [Highway](/RESTAPIs/Highway.md#license) for information about the train and bus stop data licensing.
{% endblock %}
