## GET BikePoint/box/{swLon}/{swLat}/{neLon}/{neLat}
Returns the current state of all shared bike points within a [minimum bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box). The minimum bounding box must be defined with 2 [GPS coordinates](https://en.wikipedia.org/wiki/Global_Positioning_System).

### Resource URL
    https://api.tfl.lu/v1/BikePoint/box/{swLon}/{swLat}/{neLon}/{neLat}

### Format
The response will be returned in the [GeoJSON](http://geojson.org/) format.

### Sample request & response
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
}```

### License
Please refer to [Bikepoint](/RESTAPIs/BikePoint.md#license) for information about the shared bike point data licensing.
