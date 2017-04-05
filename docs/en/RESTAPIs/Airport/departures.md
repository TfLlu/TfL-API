{% extends "/docs.md" %}
{% block content %}
# GET Airport/Departures
Returns the upcoming airplane departures from [LuxAirport](https://www.lux-airport.lu/).

## Resource URL
    https://api.tfl.lu/v1/Airport/Departures

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
| Key             | Type      | Possible values           | Description |
| --------------- | --------- | ------------------------- | ----------- |
| **id**          | `integer` | `{id}`                    | Id of the departure |
| **airline**     | `string`  | `{airline}`               | Airline |
| **flight**      | `string`  | `{flight}`                | Flight number |
| **destination** | `string`  | `{destination}`           | Destination |
| **via**         | `string`  | -`{via}`<br />- `NULL`    | If there is an intermediate stop, this value will tell you that location |
| **scheduled**   | `integer` | `{scheduled}`             | Time at which the departure is scheduled |
| **real**        | `integer` | -`{real}`<br />- `NULL`   | Real time of the departure |
| **status**      | `string`  | -`{status}`<br />- `NULL` | Status of the departure |
| **statusCode**  | `integer` | -`{statusCode}`           | StatusCode of the departure (refer to data.public.lu for LuxAirport's documentation on this) |


## Sample request & response
**GET** https://api.tfl.lu/v1/Airport/Departures
```json
[{
	"id": 34055,
	"airline": "LUXAIR",
	"flight": "LG8856",
	"destination": "Vienna",
	"via": null,
	"scheduled": 1490277600,
	"real": 1490277600,
	"status": "Expected"
}, {
	"id": 34039,
	"airline": "LUFTHANSA",
	"flight": "LH398",
	"destination": "Frankfurt",
	"via": null,
	"scheduled": 1490305800,
	"real": null,
	"status": null
}, {
	"id": 34042,
	"airline": "FLY BE",
	"flight": "BE443",
	"destination": "Birmingham",
	"via": null,
	"scheduled": 1490277600,
	"real": 1490277360,
	"status": "Expected"
}, {
    ...
}]
```

## License
Please refer to [Airport](/RESTAPIs/Airport.md#license) for information about the Airport data licensing.
{% endblock %}
