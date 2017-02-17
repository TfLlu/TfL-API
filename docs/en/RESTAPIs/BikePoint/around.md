{% extends "/docs.md" %}
{% block content %}
# GET BikePoint/around/{lon}/{lat}/{radius}
Returns the current state of all shared bike points within a given [radius](https://en.wikipedia.org/wiki/Radius) (in meters) around a [GPS coordinate](https://en.wikipedia.org/wiki/Global_Positioning_System).

## Parameters
| Parameter         | Example value                   | Description |
| ----------------- | ------------------------------- | ----------- |
| **lon** | `6.133646` | GPS longitude `float` of center |
| **lat** | `49.60067` | GPS latitude `float` of center |
| **radius** | `300` | Radius `float` (in meters) around center |

## Resource URL
    https://api.tfl.lu/v1/BikePoint/around/{lon}/{lat}/{radius}

## Format
The response will be formatted as a [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) [Feature Collection](http://geojson.org/geojson-spec.html#feature-collection-objects).

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
| **distance**              | `float`       | `{distance}`                                   | distance (in meters) from the GPS coordinate requested                   |


## Sample request & response
**GET** https://api.tfl.lu/v1/BikePoint/around/6.113204/49.61028/100000
```json
{
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.132119, 49.5986]
		},
		"properties": {
			"id": "veloh:27",
			"open": true,
			"name": "MERCIER",
			"city": null,
			"address": "MERCIER - RUE DU COMMERCE / PARKING",
			"photo": null,
			"docks": 15,
			"available_bikes": 8,
			"available_ebikes": 0,
			"available_docks": 7,
			"last_update": 1485791158000,
			"dock_status": [{
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}],
			"distance": 255.41
		}
	}, {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.13736, 49.60164]
		},
		"properties": {
			"id": "veloh:37",
			"open": true,
			"name": "GAULOIS",
			"city": null,
			"address": "GAULOIS - Rue des gaulois 11",
			"photo": null,
			"docks": 15,
			"available_bikes": 11,
			"available_ebikes": 0,
			"available_docks": 4,
			"last_update": 1485791214000,
			"dock_status": [{
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}],
			"distance": 288.89
		}
	}, {
        ...
    }]
}
```

## License
Please refer to [Bikepoint](/RESTAPIs/BikePoint.md#license) for information about the shared bike point data licensing.
{% endblock %}
