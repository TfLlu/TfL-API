{% extends "/docs.md" %}
{% block content %}
## GET StopPoint/around/{lon}/{lat}/{radius}
Returns all train and bus stops within a given [radius](https://en.wikipedia.org/wiki/Radius) (in meters) around a [GPS coordinate](https://en.wikipedia.org/wiki/Global_Positioning_System).

### Resource URL
    https://api.tfl.lu/v1/StopPoint/around/{lon}/{lat}/{radius}

### Format
The response will be formatted as a [GeoJSON](http://geojson.org/) [Feature Collection](http://geojson.org/geojson-spec.html#feature-collection-objects).

### Object properties
| Key          | Type      | Possible values | Description |
| ------------ | --------- | --------------- | ----------- |
| **id**       | `integer` | - `{id}`         | id of bus and/or train stop |
| **name**     | `string`  | - `{name}`       | name of bus and/or train stop (used for search) |
| **distance** | `float`   | - `{distance}`   | distance (in meters) from the GPS coordinate requested |

### Sample request & response
**GET** https://api.tfl.lu/v1/StopPoint/around/6.133646/49.60067/100
```json
{
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.133052, 49.601039]
		},
		"properties": {
			"id": 200405033,
			"name": "Luxembourg, Gare Centrale Quai 101",
			"distance": 59.36
		}
	}, {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.133205, 49.600814]
		},
		"properties": {
			"id": 200405002,
			"name": "Luxembourg, Gare Centrale Quai 102",
			"distance": 35.63
		}
	}, {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.133646, 49.60067]
		},
		"properties": {
			"id": 200405035,
			"name": "Luxembourg, Gare Centrale",
			"distance": 0
		}
	}]
}
```

### License
Please refer to [StopPoint](/RESTAPIs/StopPoint.md#license) for information about the train and bus stop data licensing.
{% endblock %}
