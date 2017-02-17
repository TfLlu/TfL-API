{% extends "/docs.md" %}
{% block content %}
# GET StopPoint/Departures
Returns the 20 next departures from all bus and/or train stops and sends you updates as they are processed by our engine.

## Resource URL
    /StopPoint/Departures

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
| Key               | Type      | Possible values                   | Description |
| ----------------- | --------- | --------------------------------- | ----------- |
| **id**            | `string`  | `{id}`                            | Id of the departure |
| **type**          | `string`  | - `'train'`<br />- `'bus'`        | type of transportation |
| **trainId**       | `string`  | - `{trainId}`<br />- `NULL`       | train id _(null on busses)_ |
| **line**          | `string`  | - `{line}`<br />- `NULL`          | bus or train line (currently null for all trains as info is missing on [Verkéiersverbond](https://data.public.lu/en/organizations/mobiliteitszentral/) API) |
| **number**        | `integer` | `{number}`                        | number given by [Verkéiersverbond](https://data.public.lu/en/organizations/mobiliteitszentral/). _Do not trust it to be unique_ |
| **departure**     | `integer` | `{departure}`                     | calculated real life departure of train/bus in [Unix time](https://en.wikipedia.org/wiki/Unix_time) |
| **delay**         | `integer` | `{delay}`                         | offset between `{departure}` and scheduled departure in seconds |
| **live**          | `boolean` | - `true`<br />- `false`           | wether live data is available for the given train/bus or not |
| **departureISO**  | `string`  | `{departureISO}`                  | calculated real life departure of train/bus in [ISO 8601 time](https://en.wikipedia.org/wiki/ISO_8601) |
| **destination**   | `string`  | `{destination}`                   | name of destination |
| **destinationId** | `integer` | <nobr>- `{destinationId}`</nobr><br />- `NULL` | id of destination as found on `/StopPoint/{id}` or `NULL` if unknown |

## Sample channel & response
/StopPoint/Departures
```json
{
	"type": "new",
	"data": {
		"8001267": [],
		"8001340": [],
		"8225151": [{
			"id": "1|3349|0|82|17022017",
			"type": "bus",
			"trainId": null,
			"line": "319",
			"number": 4213,
			"departure": 1487341140,
			"delay": 0,
			"live": false,
			"departureISO": "2017-02-17T15:19:00+01:00",
			"destination": "Piennes-Zone d'activités",
			"destinationId": 8225751
		}, {
			"id": "1|3349|1|82|17022017",
			"type": "bus",
			"trainId": null,
			"line": "319",
			"number": 4214,
			"departure": 1487351940,
			"delay": 0,
			"live": false,
			"departureISO": "2017-02-17T18:19:00+01:00",
			"destination": "Piennes-Zone d'activités",
			"destinationId": 8225751
		} {
            ...
        }],
		"8225172": [{
			"id": "1|3353|0|82|17022017",
			"type": "bus",
			"trainId": null,
			"line": "319",
			"number": 4224,
			"departure": 1487342820,
			"delay": 0,
			"live": false,
			"departureISO": "2017-02-17T15:47:00+01:00",
			"destination": "Luxembourg, Gare routière",
			"destinationId": 200405036
		}, {
            ...
        }]
    }
}
```

## License
Please refer to [StopPoint/Departures](/RESTAPIs/StopPoint/departures.md#license) for information about the train and bus departures data licensing.
{% endblock %}
