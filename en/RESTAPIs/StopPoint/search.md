{% extends "/docs.md" %}
{% block content %}
# GET StopPoint/Search/{query}
Returns all train and bus stops matching the search query. The results are provided by [fuzzy](https://www.npmjs.com/package/fuzzy) returning matches based on the stop's name.

## Parameters
| Parameter         | Example value                   | Description |
| ----------------- | ------------------------------- | ----------- |
| **query** | `Schoenach` | Search query `string` to look for train and/or bus stops |

## Resource URL
    https://api.tfl.lu/v1/StopPoint/Search/{query}

## Format
The response will be formatted as a [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) [Feature Collection](http://geojson.org/geojson-spec.html#feature-collection-objects).

## Object properties
| Key          | Type      | Possible values | Description |
| ------------ | --------- | --------------- | ----------- |
| **id**       | `integer` | - `{id}`         | id of bus and/or train stop |
| **name**     | `string`  | - `{name}`       | name of bus and/or train stop (used for search) |

## Sample request & response
**GET** https://api.tfl.lu/v1/StopPoint/search/Schoenach
```json
{
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.057903, 49.622199]
		},
		"properties": {
			"id": 200901011,
			"name": "Strassen, Schoenacht"
		}
	}]
}
```

## License
Please refer to [StopPoint](/RESTAPIs/StopPoint.md#license) for information about the train and bus stop data licensing.
{% endblock %}
