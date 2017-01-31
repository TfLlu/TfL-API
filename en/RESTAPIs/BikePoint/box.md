{% extends "/docs.md" %}
{% block content %}
# GET BikePoint/box/{swLon}/{swLat}/{neLon}/{neLat}
Returns the current state of all shared bike points within a [minimum bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box). The minimum bounding box must be defined by 2 [GPS coordinates](https://en.wikipedia.org/wiki/Global_Positioning_System) south west and north east.

## Parameters
| Parameter         | Example value                   | Description |
| ----------------- | ------------------------------- | ----------- |
| **swLon** | `6.10` | GPS longitude `float` of south west [minimum bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box) location |
| **swLat** | `49.5` | GPS latitude `float` of south west [minimum bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box) location |
| **neLon** | `6.11` | GPS longitude `float` of north east [minimum bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box) location |
| **neLat** | `49.55` | GPS latitude `float` of north east [minimum bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box) location |

## Resource URL
    https://api.tfl.lu/v1/BikePoint/box/{swLon}/{swLat}/{neLon}/{neLat}

## Format
The response will be formatted as a [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) [Feature Collection](http://geojson.org/geojson-spec.html#feature-collection-objects).

## Object properties
| Key                       | Type          | Possible values                                | Description |
| -------------             | ------------- | ---------------------------------------------- | --- |
| **id**                    | `string`      | <nobr>- `{provider}:{number}`</nobr>           | id of the shared bike point (built from provider and id of provider) |
| **open**                  | `boolean`     | - `true`<br />- `false`                        | status of the shared bike point (open or closed) |
| **name**                  | `string`      | - `{name}`                                     | name of the shared bike point (often a [POI](https://en.wikipedia.org/wiki/Point_of_interest) next to the station or the street name) |
| **city**                  | `string`      | - `{city}`<br />- `NULL`                       | city in which shared bike point is located (can be null if not provided) |
| **address**               | `string`      | - `{address}`                                  | street address of shared bike point |
| **photo**                 | `string`      | - `{photo}`<br />- `NULL`                      | photo of the shared bike point (only provided by velok for now) |
| **docks**                 | `integer`     | - `{docks}`                                    | total amount of docks |
| **available_bikes**       | `integer`     | - `{available_bikes}`                          | amount of available bikes which are of type `manual` |
| **available_ebikes**      | `integer`     | - `{available_ebikes}`                         | amount of available bikes which are of type `electric` |
| **available_docks**       | `integer`     | - `{available_docks}`                          | amount of free docks at shared bike point |
| **last_update**           | `integer`     | - `{last_update}`<br />- `NULL`                | last update of the data from the shared bike point in [Unix time](https://en.wikipedia.org/wiki/Unix_time) (milliseconds), `NULL` means realtime |
| **dock_status**           | `array`       |                                                | array of single dock statuses |
| **dock_status.status**    | `string`      | - `'free'`<br />- `'occupied'`                 | status of specific dock, can be free or occupied |
| **dock_status.bikeType**  | `string`      | - `'manual'`<br />- `'electric'`<br />- `NULL` | type of bike attached to dock, `NULL` if dock is free |
| **distance**              | `float`       | - `{distance}`                                 | distance (in meters) from the GPS coordinate requested |

## Sample request & response
**GET** https://api.tfl.lu/v1/BikePoint/box/6.10/49.5/6.11/49.55
```json
{
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.101875, 49.516036]
		},
		"properties": {
			"id": "velok:46",
			"open": true,
			"name": "Gare CFL Bettembourg",
			"city": "Bettembourg",
			"address": "Place de la Gare",
			"photo": "https://webservice.velok.lu/images/photos/46.jpg",
			"docks": 7,
			"available_bikes": 0,
			"available_ebikes": 1,
			"available_docks": 6,
			"last_update": null,
			"dock_status": [{
				"status": "free",
				"bikeType": null
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
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}]
		}
	}, {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.108912, 49.517218]
		},
		"properties": {
			"id": "velok:47",
			"open": true,
			"name": "Reebou-Schoul",
			"city": "Bettembourg",
			"address": "Rue Marie Therèse",
			"photo": "https://webservice.velok.lu/images/photos/47.jpg",
			"docks": 5,
			"available_bikes": 0,
			"available_ebikes": 4,
			"available_docks": 1,
			"last_update": null,
			"dock_status": [{
				"status": "occupied",
				"bikeType": "electric"
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "occupied",
				"bikeType": "electric"
			}, {
				"status": "occupied",
				"bikeType": "electric"
			}, {
				"status": "occupied",
				"bikeType": "electric"
			}]
		}
	}]
}
```

## License
Please refer to [Bikepoint](/RESTAPIs/BikePoint.md#license) for information about the shared bike point data licensing.
{% endblock %}
