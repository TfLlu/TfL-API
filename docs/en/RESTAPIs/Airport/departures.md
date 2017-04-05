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
	"id": 37036,
	"airline": "LUXAIR",
	"flight": "LG4607",
	"destination": "London-City",
	"via": null,
	"scheduled": 1491387900,
	"real": null,
	"status": null,
	"statusCode": 4
}, {
	"id": 37032,
	"airline": "LUXAIR",
	"flight": "LG5483",
	"destination": "Prague",
	"via": null,
	"scheduled": 1491388800,
	"real": null,
	"status": null,
	"statusCode": 4
}, {
	"id": 37023,
	"airline": "LUXAIR",
	"flight": "LG8255",
	"destination": "Nice",
	"via": null,
	"scheduled": 1491389700,
	"real": null,
	"status": null,
	"statusCode": 4
}, {
    ...
}]
```

## License
Please refer to [Airport](/RESTAPIs/Airport.md#license) for information about the Airport data licensing.
{% endblock %}
