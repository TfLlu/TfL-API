## GET BikePoint
Returns the current state of all shared bike points from Luxembourg integrated in TfL.

### Resource URL
    https://api.tfl.lu/v1/BikePoint

### Format
The response will be returned in the [GeoJSON](http://geojson.org/) format.

### Sample request & response
**GET** https://api.tfl.lu/v1/BikePoint
```json
{
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [5.98276, 49.49473]
		},
		"properties": {
			"id": "velok:1",
			"open": true,
			"name": "Avenue de la Gare",
			"city": "Esch-sur-Alzette",
			"address": "Coin Rue de l’Alzette",
			"photo": "https://webservice.velok.lu/images/photos/1.jpg",
			"docks": 7,
			"available_bikes": 4,
			"available_ebikes": 0,
			"available_docks": 3,
			"last_update": null,
			"dock_status": [{
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}]
		}
	}, {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [5.977421, 49.494626]
		},
		"properties": {
			"id": "velok:2",
			"open": true,
			"name": "Rue du Canal",
			"city": "Esch-sur-Alzette",
			"address": "Coin Rue Dicks",
			"photo": "https://webservice.velok.lu/images/photos/2.jpg",
			"docks": 8,
			"available_bikes": 1,
			"available_ebikes": 0,
			"available_docks": 7,
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
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "free",
				"bikeType": null
			}, {
				"status": "free",
				"bikeType": null
			}]
		}
	}, {
        ...
    }]
}
```

### License
Please refer to [Bikepoint](/RESTAPIs/BikePoint.md#license) for information about the shared bike point data licensing.
