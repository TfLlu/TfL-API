{% extends "/docs.md" %}
{% block content %}
# /BikePoint/{ID}
Returns the current state one single shared bike point requested by the ID parameter and sends you updates as they are processed by our engine.

## Parameters
| Parameter | Example value | Description |
| --------  | ------------- | ----------- |
| **id**    | `velok:1`     | Id `string` of shared bike point as found in [`GET /BikePoint`](/RESTAPIs/BikePoint/index.md) |

## Channel URL
    /BikePoint/{ID}

## Format
The response will be formatted as a [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) [Feature](http://geojson.org/geojson-spec.html#feature-objects).

## Object properties
| Key                       | Type          | Possible values                                | Description                                                              |
| -------------             | ------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| **id**                    | `string`      | <nobr>`{provider}:{number}`</nobr>             | id of the shared bike point (built from provider and id of provider)     |
| **open**                  | `boolean`     | - `true`<br />- `false`                        | status of the shared bike point (open or closed)                         |
| **name**                  | `string`      | `{name}`                                       | name of the shared bike point (often a [POI](https://en.wikipedia.org/wiki/Point_of_interest) next to the station or the street name) |
| **city**                  | `string`      | - `{city}`<br />- `NULL`                       | city in which shared bike point is located (can be null if not provided) |
| **address**               | `string`      | `{address}`                                    | street address of shared bike point                                      |
| **photo**                 | `string`      | - `{photo}`<br />- `NULL`                      | photo of the shared bike point (only provided by velok for now)          |
| **docks**                 | `integer`     | `{docks}`                                      | total amount of docks                                                    |
| **available_bikes**       | `integer`     | `{available_bikes}`                            | amount of available bikes which are of type `manual`                     |
| **available_ebikes**      | `integer`     | `{available_ebikes}`                           | amount of available bikes which are of type `electric`                   |
| **available_docks**       | `integer`     | `{available_docks}`                            | amount of free docks at shared bike point                                |
| **last_update**           | `integer`     | - `{last_update}`<br />- `NULL`                | last update of the data from the shared bike point in [Unix time](https://en.wikipedia.org/wiki/Unix_time) (milliseconds), `NULL` means realtime |
| **dock_status**           | `array`       |                                                | array of single dock statuses                                            |
| **dock_status.status**    | `string`      | - `'free'`<br />- `'occupied'`                 | status of specific dock, can be free or occupied                         |
| **dock_status.bikeType**  | `string`      | - `'manual'`<br />- `'electric'`<br />- `NULL` | type of bike attached to dock, `NULL` if dock is free                    |

## Sample channel & response
/BikePoint/velok:45
```json
{
	"type": "update",
	"data": [{
		"id": "velok:45",
		"data": {
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [6.098616, 49.515518]
			},
			"properties": {
				"id": "velok:45",
				"open": true,
				"name": "An der Schwemm",
				"city": "Bettembourg",
				"address": "Rue James-Hilliard Polk",
				"photo": "https://webservice.velok.lu/images/photos/45.jpg",
				"docks": 10,
				"available_bikes": 0,
				"available_ebikes": 5,
				"available_docks": 5,
				"last_update": null,
				"dock_status": [{
					"status": "occupied",
					"bikeType": "electric"
				}, {
					"status": "free",
					"bikeType": null
				}, {
					"status": "free",
					"bikeType": null
				}, {
					"status": "occupied",
					"bikeType": "electric"
				}, {
					"status": "free",
					"bikeType": null
				}, {
					"status": "occupied",
					"bikeType": "electric"
				}, {
					"status": "free",
					"bikeType": null
				}, {
					"status": "occupied",
					"bikeType": "electric"
				}, {
					"status": "free",
					"bikeType": null
				}, {
					"status": "occupied",
					"bikeType": "electric"
				}]
			}
		}
	}]
}
```

## License
Please refer to [Bikepoint](/Streaming_APIs/BikePoint.md#license) for information about the shared bike point data licensing.
{% endblock %}
