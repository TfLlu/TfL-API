{% extends "/docs.md" %}
{% block content %}
# GET Journey/{from}/to/{to}
Returns the itinerary from `{from}` to `{to}` in the [OpenTripPlanner](http://www.opentripplanner.org/) format.

## Parameters
| Parameter         | Example value                   | Description |
| ----------------- | ------------------------------- | ----------- |
| **from** | `49.59744,6.14077` | Latitude (_float_) and longitude (_float_) separated by a comma |
| **to** | `49.542,6.19942` | Latitude (_float_) and longitude (_float_) separated by a comma |

## Resource URL
    https://api.tfl.lu/v1/Journey/{from}/to/{to}

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
The [OpenTripPlanner](http://www.opentripplanner.org/) API documentation can be found here: [http://dev.opentripplanner.org/apidoc/1.0.0/json_Response.html](http://dev.opentripplanner.org/apidoc/1.0.0/json_Response.html)


## Sample request & response
**GET** https://api.tfl.lu/v1/Journey/49.59744,6.14077/to/49.542,6.19942
```json
{
	"error": "null",
	"requestParameters": {
		"time": "14:07:40",
		"arriveBy": true,
		"maxWalkDistance": 2000,
		"fromPlace": "NONE",
		"toPlace": "NONE",
		"date": "2016-10-11",
		"mode": "TRANSIT,WALK"
	},
	"plan": {
		"date": 1476144000000,
		"from": {
			"name": "NONE",
			"stopId": {
				"agencyId": "NL",
				"id": "NONE"
			},
			"stopCode": null,
			"platformCode": null,
			"lat": 0,
			"lon": 0,
			"wheelchairBoarding": null,
			"visualAccessible": null,
			"arrival": null,
			"departure": null
		},
		"to": {
			"name": "NONE",
			"stopId": {
				"agencyId": "NL",
				"id": "NONE"
			},
			"stopCode": null,
			"platformCode": null,
			"lat": 0,
			"lon": 0,
			"wheelchairBoarding": null,
			"visualAccessible": null,
			"arrival": null,
			"departure": null
		},
		"itineraries": [{
			"duration": 1392000,
			"startTime": 1476185628000,
			"endTime": 1476187020000,
			"transfers": 0,
			"legs": [{
				"from": {
					"name": "NONE",
					"stopId": {
						"agencyId": "NL",
						"id": "NONE"
					},
					"stopCode": null,
					"platformCode": null,
					"lat": 0,
					"lon": 0,
					"wheelchairBoarding": null,
					"visualAccessible": null,
					"arrival": null,
					"departure": 1476185628000
				},
				"to": {
					"name": "Bonnevoie, Hippodrome",
					"stopId": {
						"agencyId": "NL",
						"id": "200404016"
					},
					"stopCode": null,
					"platformCode": "",
					"lat": 49.5933,
					"lon": 6.13905,
					"wheelchairBoarding": null,
					"visualAccessible": null,
					"arrival": 1476186000000,
					"departure": null
				},
				"mode": "WALK",
				"startTime": 1476185628000,
				"endTime": 1476186000000,
				"departureDelay": 0,
				"arrivalDelay": 0,
				"route": null,
				"routeShortName": null,
				"routeLongName": null,
				"routeId": null,
				"routeColor": null,
				"routeTextColor": null,
				"headsign": null,
				"tripId": null,
				"serviceDate": "",
				"agencyId": null,
				"agencyName": null,
				"agencyUrl": null,
				"wheelchairAccessible": null,
				"productCategory": null,
				"legGeometry": {
					"points": "__vmHyjnd@zXvI",
					"levels": null,
					"length": 2
				},
				"intermediateStops": [],
				"duration": 372000
			}, {
				"from": {
					"name": "Bonnevoie, Hippodrome",
					"stopId": {
						"agencyId": "NL",
						"id": "200404016"
					},
					"stopCode": null,
					"platformCode": "",
					"lat": 49.5933,
					"lon": 6.13905,
					"wheelchairBoarding": null,
					"visualAccessible": null,
					"arrival": null,
					"departure": 1476186000000
				},
				"to": {
					"name": "Weiler-la-Tour, Gëltz",
					"stopId": {
						"agencyId": "NL",
						"id": "201103002"
					},
					"stopCode": null,
					"platformCode": "",
					"lat": 49.542,
					"lon": 6.19942,
					"wheelchairBoarding": null,
					"visualAccessible": null,
					"arrival": 1476187020000,
					"departure": null
				},
				"mode": "BUS",
				"startTime": 1476186000000,
				"endTime": 1476187020000,
				"departureDelay": 0,
				"arrivalDelay": 0,
				"route": "Hassel, Küneftchen - Kirchberg, Rehazenter",
				"routeShortName": "192",
				"routeLongName": "Hassel, Küneftchen - Kirchberg, Rehazenter",
				"routeId": "3:CFLBUS:192",
				"routeColor": "",
				"routeTextColor": "",
				"headsign": "Hassel, Küneftchen",
				"tripId": "3:CFLBUS:256",
				"serviceDate": "20161011",
				"agencyId": "3",
				"agencyName": "RGTR",
				"agencyUrl": "http://mobiliteit.lu",
				"agencyTimeZoneOffset": "7200000",
				"wheelchairAccessible": null,
				"productCategory": "Bus",
				"legGeometry": {
					"points": "ceumHa`nd@pPyJvZqPbY}\\x\\q_@`VmUjKwO`ViEpR}FvjBghAzsA}d@qb@axAwNw^",
					"levels": null,
					"length": 13
				},
				"intermediateStops": [],
				"duration": 1020000
			}, {
				"from": {
					"name": "Weiler-la-Tour, Gëltz",
					"stopId": {
						"agencyId": "NL",
						"id": "201103002"
					},
					"stopCode": null,
					"platformCode": "",
					"lat": 49.542,
					"lon": 6.19942,
					"wheelchairBoarding": null,
					"visualAccessible": null,
					"arrival": null,
					"departure": 1476187020000
				},
				"to": {
					"name": "NONE",
					"stopId": {
						"agencyId": "NL",
						"id": "NONE"
					},
					"stopCode": null,
					"platformCode": null,
					"lat": 0,
					"lon": 0,
					"wheelchairBoarding": null,
					"visualAccessible": null,
					"arrival": 1476187020000,
					"departure": null
				},
				"mode": "WALK",
				"startTime": 1476187020000,
				"endTime": 1476187020000,
				"departureDelay": 0,
				"arrivalDelay": 0,
				"route": null,
				"routeShortName": null,
				"routeLongName": null,
				"routeId": null,
				"routeColor": null,
				"routeTextColor": null,
				"headsign": null,
				"tripId": null,
				"serviceDate": "",
				"agencyId": null,
				"agencyName": null,
				"agencyUrl": null,
				"wheelchairAccessible": null,
				"productCategory": null,
				"legGeometry": {
					"points": "odkmHkyyd@??",
					"levels": null,
					"length": 2
				},
				"intermediateStops": [],
				"duration": 0
			}],
			"walkTime": 372,
			"transitTime": 1020,
			"waitingTime": 0,
			"walkDistance": 372,
			"walkLimitExceeded": false,
			"elevationLost": 0,
			"elevationGained": 0,
			"occupancyStatus": null
		}]
	}
}
```

## License
Please refer to [Journey](/RESTAPIs/Journey.md#license) for information about the journey planners' data licensing.
{% endblock %}
