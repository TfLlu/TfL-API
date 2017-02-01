{% extends "/docs.md" %}
{% block content %}
# GET StopPoint/{ID}
Returns a single bus and/or train stop requested by the ID parameter.

## Parameters
| Parameter         | Example value                   | Description |
| ----------------- | ------------------------------- | ----------- |
| **id** | `200901011` | Id `integer` of train and/or bus stop as found in [`/StopPoint`](/RESTAPIs/StopPoint/index.md) |

## Resource URL
    https://api.tfl.lu/v1/StopPoint/{ID}

## Format
The response will be formatted as a [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) [Feature](http://geojson.org/geojson-spec.html#feature-objects).

## Object properties
| Key          | Type      | Possible values | Description |
| ------------ | --------- | --------------- | ----------- |
| **id**       | `integer` | `{id}`          | id of bus and/or train stop |
| **name**     | `string`  | `{name}`        | name of bus and/or train stop (used for search) |

## Sample request & response
**GET** https://api.tfl.lu/v1/StopPoint/200901011
```json
{
	"type": "Feature",
	"geometry": {
		"type": "Point",
		"coordinates": [6.057903, 49.622199]
	},
	"properties": {
		"id": 200901011,
		"name": "Strassen, Schoenacht"
	}
}
```

## License
Please refer to [StopPoint](/RESTAPIs/StopPoint.md#license) for information about the train and bus stop data licensing.
{% endblock %}
