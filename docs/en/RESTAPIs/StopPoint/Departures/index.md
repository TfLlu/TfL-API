{% extends "/docs.md" %}
{% block content %}
# GET StopPoint/Departures
Returns the 20 next departures from all bus and/or train stops.

## Resource URL
    https://api.tfl.lu/v1/StopPoint/Departures

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
| Key               | Type      | Possible values                   | Description |
| ----------------- | --------- | --------------------------------- | ----------- |
| **id**            | `string`  | `{id}`                            | Id of the departure |
| **type**          | `string`  | - `'train'`<br />- `'bus'`        | type of transportation |
| **trainId**       | `string`  | - `{trainId}`<br />- `NULL`       | train id _(null on busses)_ |
| **line**          | `string`  | - `{line}`<br />- `NULL`          | bus or train line (currently null for all trains as info is missing on [Verkéiersverbond](https://data.public.lu/en/organizations/mobiliteitszentral/) API) |
| **lineId**        | `string`  | `{lineId}`                        | bus or train line identifier (can be used to map departure to a [line](/RESTAPIs/Line/index.md)) |
| **number**        | `integer` | `{number}`                        | number given by [Verkéiersverbond](https://data.public.lu/en/organizations/mobiliteitszentral/). _Do not trust it to be unique_ |
| **departure**     | `integer` | `{departure}`                     | calculated real life departure of train/bus in [Unix time](https://en.wikipedia.org/wiki/Unix_time) |
| **delay**         | `integer` | `{delay}`                         | offset between `{departure}` and scheduled departure in seconds |
| **live**          | `boolean` | - `true`<br />- `false`           | wether live data is available for the given train/bus or not |
| **departureISO**  | `string`  | `{departureISO}`                  | calculated real life departure of train/bus in [ISO 8601 time](https://en.wikipedia.org/wiki/ISO_8601) |
| **destination**   | `string`  | `{destination}`                   | name of destination |
| **destinationId** | `integer` | <nobr>- `{destinationId}`</nobr><br />- `NULL` | id of destination as found on `/StopPoint/{id}` or `NULL` if unknown |

## Sample request & response
**GET** https://api.tfl.lu/v1/StopPoint/Departures
```json
{
	"8225152": [{
		"id": "1|3130|1|82|16032017",
		"type": "bus",
		"trainId": null,
		"lineId": "3:RGM---:319",
		"line": "319",
		"number": 4223,
		"departure": 1489664040,
		"delay": 0,
		"live": false,
		"departureISO": "2017-03-16T12:34:00+01:00",
		"destination": "Luxembourg, Gare routière",
		"destinationId": 200405036
	}, {
		...
	}],
	"8225161": [{
		"id": "1|3127|0|82|16032017",
		"type": "bus",
		"trainId": null,
		"lineId": "3:RGM---:319",
		"line": "319",
		"number": 4212,
		"departure": 1489667040,
		"delay": 0,
		"live": false,
		"departureISO": "2017-03-16T13:24:00+01:00",
		"destination": "Piennes-Zone d'activités",
		"destinationId": 8225751
	}, {
		...
	}],
	"8225162": [{
		"id": "1|3130|1|82|16032017",
		"type": "bus",
		"trainId": null,
		"lineId": "3:RGM---:319",
		"line": "319",
		"number": 4223,
		"departure": 1489663680,
		"delay": 0,
		"live": false,
		"departureISO": "2017-03-16T12:28:00+01:00",
		"destination": "Luxembourg, Gare routière",
		"destinationId": 200405036
	}, {
		"id": "1|3132|0|82|16032017",
		"type": "bus",
		"trainId": null,
		"lineId": "3:RGM---:319",
		"line": "319",
		"number": 4224,
		"departure": 1489675680,
		"delay": 0,
		"live": false,
		"departureISO": "2017-03-16T15:48:00+01:00",
		"destination": "Luxembourg, Gare routière",
		"destinationId": 200405036
	}, {
		...
	}]
}
```

## License
Please refer to [StopPoint/Departures](/RESTAPIs/StopPoint/departures.md#license) for information about the train and bus departures data licensing.
{% endblock %}
