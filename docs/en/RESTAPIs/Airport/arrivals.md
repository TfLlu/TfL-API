{% extends "/docs.md" %}
{% block content %}
# GET Airport/Arrivals
Returns the upcoming airplane arrivals from [LuxAirport](https://www.lux-airport.lu/).

## Resource URL
    https://api.tfl.lu/v1/Airport/Arrivals

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
| Key             | Type      | Possible values           | Description |
| --------------- | --------- | ------------------------- | ----------- |
| **id**          | `integer` | `{id}`                    | Id of the arrival |
| **airline**     | `string`  | `{airline}`               | Airline |
| **flight**      | `string`  | `{flight}`                | Flight number |
| **destination** | `string`  | `{destination}`           | Destination |
| **via**         | `string`  | -`{via}`<br />- `NULL`    | If there is an intermediate stop, this value will tell you that location |
| **scheduled**   | `integer` | `{scheduled}`             | Time at which the arrival is scheduled |
| **real**        | `integer` | -`{real}`<br />- `NULL`   | Real time of the arrival |
| **status**      | `string`  | -`{status}`<br />- `NULL` | Status of the arrival |
| **statusCode**  | `integer` | -`{statusCode}`           | StatusCode of the arrival (refer to data.public.lu for LuxAirport's documentation on this) |


## Sample request & response
**GET** https://api.tfl.lu/v1/Airport/Arrivals
```json
[{
	"id": 37087,
	"airline": "LUXAIR",
	"flight": "LG9472",
	"destination": "Berlin-Tegel",
	"via": null,
	"scheduled": 1491381600,
	"real": 1491382200,
	"status": "Expected",
	"statusCode": 9
}, {
	"id": 37129,
	"airline": "TAP - Air Portugal",
	"flight": "TP694",
	"destination": "Lisbon",
	"via": null,
	"scheduled": 1491387300,
	"real": 1491388200,
	"status": "Expected",
	"statusCode": 9
}, {
	"id": 37148,
	"airline": "Ryanair",
	"flight": "FR5054",
	"destination": "Madrid",
	"via": null,
	"scheduled": 1491387600,
	"real": 1491387900,
	"status": "Expected",
	"statusCode": 9
}, {
    ...
}]
```

## License
Please refer to [Airport](/RESTAPIs/Airport.md#license) for information about the Airport data licensing.
{% endblock %}
