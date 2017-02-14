{% extends "/docs.md" %}
{% block content %}
# GET StopPoint/Departures/{ID}
Returns the 20 next departures from a single bus and/or train stop requested by the ID parameter.

## Parameters
| Parameter         | Example value                   | Description |
| ----------------- | ------------------------------- | ----------- |
| **id** | `200405035` | Id `integer` of train and/or bus stop to get departures returned for |

## Resource URL
    https://api.tfl.lu/v1/StopPoint/Departures/{ID}

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

## Sample request & response
**GET** https://api.tfl.lu/v1/StopPoint/Departures/200405035
```json
[{
	"id": "1|5232|4|82|14022017",
	"type": "bus",
	"trainId": null,
	"line": "13",
	"number": 1123,
	"departure": 1487086020,
	"delay": 0,
	"live": true,
	"departureISO": "2017-02-14T16:27:00+01:00",
	"destination": "Luxembourg/Strassen, Centre Hospitalier",
	"destinationId": 200405008
}, {
	"id": "1|5776|0|82|14022017",
	"type": "bus",
	"trainId": null,
	"line": "9",
	"number": 2660,
	"departure": 1487086020,
	"delay": 0,
	"live": true,
	"departureISO": "2017-02-14T16:27:00+01:00",
	"destination": "Cents, Waassertuerm",
	"destinationId": 200406019
}, {
	...
}]
```

## License
Please refer to [StopPoint/Departures](/RESTAPIs/StopPoint/Departures.md#license) for information about the train and bus departures data licensing.
{% endblock %}
