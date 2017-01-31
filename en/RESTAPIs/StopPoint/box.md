{% extends "/docs.md" %}
{% block content %}
## GET StopPoint/box/{swLon}/{swLat}/{neLon}/{neLat}
Returns all train and bus stops within a [minimum bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box). The minimum bounding box must be defined by 2 [GPS coordinates](https://en.wikipedia.org/wiki/Global_Positioning_System) South-West and North-East.

### Resource URL
    https://api.tfl.lu/v1/StopPoint/box/{swLon}/{swLat}/{neLon}/{neLat}

### Format
The response will be formatted as a [GeoJSON](http://geojson.org/) [Feature Collection](http://geojson.org/geojson-spec.html#feature-collection-objects).

### Object properties
| Key          | Type      | Possible values | Description |
| ------------ | --------- | --------------- | ----------- |
| **id**       | `integer` | - `{id}`         | id of bus and/or train stop |
| **name**     | `string`  | - `{name}`       | name of bus and/or train stop (used for search) |

### Sample request & response
**GET** https://api.tfl.lu/v1/StopPoint/box/6.133052/49.60067/6.133646/49.600814
```json
{
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.133205, 49.600814]
		},
		"properties": {
			"id": 200405002,
			"name": "Luxembourg, Gare Centrale Quai 102"
		}
	}, {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.133646, 49.60067]
		},
		"properties": {
			"id": 200405035,
			"name": "Luxembourg, Gare Centrale"
		}
	}]
}
```

### License
Please refer to [StopPoint](/RESTAPIs/StopPoint.md#license) for information about the train and bus stop data licensing.
{% endblock %}
