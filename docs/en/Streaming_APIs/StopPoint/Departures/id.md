{% extends "/docs.md" %}
{% block content %}
# /StopPoint/Departures/{ID}
Returns the 20 next departures from a single bus and/or train stop requested by the ID parameter and sends you updates as they are processed by our engine.

## Parameters
| Parameter         | Example value                   | Description |
| ----------------- | ------------------------------- | ----------- |
| **id** | `200405035` | Id `integer` of train and/or bus stop to get departures returned for |

## Resource URL
    /Departures/{ID}

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
/Departures/200405035
```json
{
	"type": "update",
	"data": {
		"200405035": [{
			"id": "1|501|22|82|17022017",
			"type": "bus",
			"trainId": null,
			"line": "19",
			"number": 2059,
			"departure": 1487339700,
			"delay": 240,
			"live": true,
			"departureISO": "2017-02-17T14:55:00+01:00",
			"destination": "Limpertsberg, Neumanns-Park",
			"destinationId": 200419029
		}, {
			"id": "1|3582|2|82|17022017",
			"type": "bus",
			"trainId": null,
			"line": "195",
			"number": 598,
			"departure": 1487340480,
			"delay": 780,
			"live": true,
			"departureISO": "2017-02-17T15:08:00+01:00",
			"destination": "Kirchberg, Rehazenter",
			"destinationId": 200417034
		}]
	}
}
```

## License
Please refer to [StopPoint/Departures](/Streaming_APIs/StopPoint/departures.md#license) for information about the train and bus departures data licensing.
{% endblock %}
