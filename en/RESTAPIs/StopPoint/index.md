{% extends "/docs.md" %}
{% block content %}
# GET StopPoint
Returns all train and bus stops from Luxembourg integrated in Transport for Luxembourg.

## Resource URL
    https://api.tfl.lu/v1/StopPoint

## Format
The response will be formatted as a [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) [Feature Collection](http://geojson.org/geojson-spec.html#feature-collection-objects).

## Object properties
| Key          | Type      | Possible values | Description |
| ------------ | --------- | --------------- | ----------- |
| **id**       | `integer` | - `{id}`         | id of bus and/or train stop |
| **name**     | `string`  | - `{name}`       | name of bus and/or train stop (used for search) |

## Sample request & response
**GET** https://api.tfl.lu/v1/StopPoint
```json
{
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.113204, 49.61028]
		},
		"properties": {
			"id": 200403005,
			"name": "Belair, Sacré-Coeur"
		}
	}, {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.11226, 49.612644]
		},
		"properties": {
			"id": 200403002,
			"name": "Belair, Archiducs"
		}
	}, {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.11297, 49.608284]
		},
		"properties": {
			"id": 200403007,
			"name": "Belair, Franciscaines"
		}
	}, {
        ...
    }]
}```

## License
Please refer to [StopPoint](/RESTAPIs/StopPoint.md#license) for information about the train and bus stop data licensing.
{% endblock %}
