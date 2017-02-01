## GET BikePoint/{ID}
Returns the current state one single shared bike point requested by the ID parameter.

### Resource URL
    https://api.tfl.lu/v1/BikePoint/{ID}

### Format
The response will be returned in the [GeoJSON](http://geojson.org/) format.

### Sample request & response
**GET** https://api.tfl.lu/v1/BikePoint/velok:1
```json
{
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
}
```

### License
Please refer to [Bikepoint](/RESTAPIs/BikePoint.md#license) for information about the shared bike point data licensing.
