## GET BikePoint/around/{lon}/{lat}/{radius}
Returns the current state of all shared bike points within a given [radius](https://en.wikipedia.org/wiki/Radius) (in meters) around a [GPS coordinatee](https://en.wikipedia.org/wiki/Global_Positioning_System).

### Resource URL
    https://api.tfl.lu/v1/BikePoint/around/{lon}/{lat}/{radius}

### Format
The response will be returned in the [GeoJSON](http://geojson.org/) format.

### Sample request & response
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
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.133406, 49.6006582]
		},
		"properties": {
			"id": "veloh:2",
			"open": true,
			"name": "GARE CENTRALE",
			"city": null,
			"address": "GARE CENTRALE-PLACE DE LA GARE ( SUR QUAI N° 1 )",
			"photo": null,
			"docks": 21,
			"available_bikes": 6,
			"available_ebikes": 0,
			"available_docks": 15,
			"last_update": 1485791149000,
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
			}, {
				"status": "free",
				"bikeType": null
			}],
			"distance": 17.37
		}
	}, {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.13362, 49.60098]
		},
		"properties": {
			"id": "veloh:79",
			"open": true,
			"name": "GARE CENTRALE 2",
			"city": null,
			"address": "Gare Centrale 2 - Place de Gare n°3-5",
			"photo": null,
			"docks": 17,
			"available_bikes": 3,
			"available_ebikes": 0,
			"available_docks": 14,
			"last_update": 1485791064000,
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
			"distance": 34.56
		}
	}]
}
```

### License
Please refer to [Bikepoint](/RESTAPIs/BikePoint.md#license) for information about the shared bike point data licensing.
