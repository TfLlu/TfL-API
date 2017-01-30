## GET BikePoint/Search/{query}
Returns the current state of all shared bike points matching the search query. The results are provided by [fuzzy](https://www.npmjs.com/package/fuzzy) returning matches based on the station's name, address and city.

### Resource URL
    https://api.tfl.lu/v1/BikePoint/Search/{query}

### Format
The response will be returned in the [GeoJSON](http://geojson.org/) format.

### Sample request & response
**GET** https://api.tfl.lu/v1/BikePoint/Search/Coin%20Rue%20de%20lAlzette
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
			"coordinates": [5.981152, 49.494103]
		},
		"properties": {
			"id": "velok:3",
			"open": true,
			"name": "Rue de la Libération",
			"city": "Esch-sur-Alzette",
			"address": "Coin Rue de l’Alzette",
			"photo": "https://webservice.velok.lu/images/photos/3.jpg",
			"docks": 9,
			"available_bikes": 4,
			"available_ebikes": 0,
			"available_docks": 5,
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
				"bikeType": "manual"
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
				"status": "occupied",
				"bikeType": "manual"
			}, {
				"status": "occupied",
				"bikeType": "manual"
			}]
		}
	}, {
        ...
    }]
}```

### License
Please refer to [Bikepoint](/RESTAPIs/BikePoint.md#license) for information about the shared bike point data licensing.
