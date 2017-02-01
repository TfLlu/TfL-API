{% extends "/docs.md" %}
{% block content %}
# GET StopPoint/Departures/{ID}/{limit}
Returns the X next departures from a single bus and/or train stop requested by the ID parameter, _where X is equal to your requested {limit}_.

## Parameters
| Parameter         | Example value                   | Description |
| ----------------- | ------------------------------- | ----------- |
| **id** | `200405035` | Id `integer` of train and/or bus stop to get departures returned for |
| **limit** | `3` | Amount of departures `integer` to get returned by the API |

## Resource URL
    https://api.tfl.lu/v1/StopPoint/Departures/{ID}/{limit}

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
| Key               | Type      | Possible values                   | Description |
| ----------------- | --------- | --------------------------------- | ----------- |
| **type**          | `string`  | - `train`<br />- `bus`            | type of transportation |
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
**GET** https://api.tfl.lu/v1/StopPoint/Departures/200405035/3
```json
[{
	"type": "bus",
	"trainId": null,
	"line": "195",
	"number": 307,
	"departure": 1485861600,
	"delay": 1380,
	"live": true,
	"departureISO": "2017-01-31T12:20:00+01:00",
	"destination": "Kirchberg, Rehazenter",
	"destinationId": 200417034
}, {
	"type": "bus",
	"trainId": null,
	"line": "1",
	"number": 1862,
	"departure": 1485860880,
	"delay": 120,
	"live": true,
	"departureISO": "2017-01-31T12:08:00+01:00",
	"destination": "Kirchberg, Luxexpo Entrée Sud Quai 1",
	"destinationId": 200417023
}, {
	"type": "bus",
	"trainId": null,
	"line": "194",
	"number": 263,
	"departure": 1485861060,
	"delay": 240,
	"live": true,
	"departureISO": "2017-01-31T12:11:00+01:00",
	"destination": "Sandweiler, Am Eck",
	"destinationId": 200601001
}]
```

## License
Please refer to [StopPoint/Departures](/RESTAPIs/StopPoint-Departures.md#license) for information about the train and bus departures data licensing.
{% endblock %}
