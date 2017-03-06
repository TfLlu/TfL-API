{% extends "/docs.md" %}
{% block content %}
# GET Highway/{ID}
Returns a single highway requested by the ID parameter.

## Parameters
| Parameter         | Example value                   | Description |
| ----------------- | ------------------------------- | ----------- |
| **id** | `cita:A4` | Id `string` of highway as found in [`GET /Highway`](/RESTAPIs/Highway/index.md) |

## Resource URL
    https://api.tfl.lu/v1/Highway/{ID}

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
**GET** https://api.tfl.lu/v1/Highway/cita:A4
```json
{
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
}
```

## License
Please refer to [Highway](/RESTAPIs/Highway.md#license) for information about the train and bus stop data licensing.
{% endblock %}
