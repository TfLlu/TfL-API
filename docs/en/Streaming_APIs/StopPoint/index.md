{% extends "/docs.md" %}
{% block content %}
# GET StopPoint
Returns all train and bus stops from Luxembourg integrated in Transport for Luxembourg and sends you updates as they are processed by our engine.

## Resource URL
    /StopPoint

## Format
The response will be formatted as a [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) [Feature Collection](http://geojson.org/geojson-spec.html#feature-collection-objects).

## Object properties
| Key          | Type      | Possible values | Description |
| ------------ | --------- | --------------- | ----------- |
| **id**       | `integer` | `{id}`          | id of bus and/or train stop |
| **name**     | `string`  | `{name}`        | name of bus and/or train stop (used for search) |

## Sample channel & response
/StopPoint
```json
{
	"type": "new",
	"data": [{
				"id": 200403005,
				"data": {
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [6.113204, 49.61028]
					},
					"properties": {
						"id": 200403005,
						"name": "Belair, Sacré-Coeur"
					}
				}
			}, {
				"id": 200403002,
				"data": {
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [6.11226, 49.612644]
					},
					"properties": {
						"id": 200403002,
						"name": "Belair, Archiducs"
					}
				}
			}, {
                ...
            }]
}
```

## License
Please refer to [StopPoint](/Streaming_APIs/StopPoint.md#license) for information about the train and bus stop data licensing.
{% endblock %}
