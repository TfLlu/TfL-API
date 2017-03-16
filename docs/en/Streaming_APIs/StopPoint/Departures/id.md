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
| **lineId**        | `string`  | `{lineId}`                        | bus or train line identifier (can be used to map departure to a [line](/RESTAPIs/Line/index.md)) |
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
	"type": "new",
	"data": {
        "200405035": [{
			"id": "1|1533|8|82|16032017",
			"type": "bus",
			"trainId": null,
			"lineId": "4:TIC---:13",
			"line": "13",
			"number": 180,
			"departure": 1489658400,
			"delay": 0,
			"live": true,
			"departureISO": "2017-03-16T11:00:00+01:00",
			"destination": "Esch/Alzette, Gare",
			"destinationId": 220402034
		}, {
			"id": "1|1968|2|82|16032017",
			"type": "bus",
			"trainId": null,
			"lineId": "3:RGM---:212",
			"line": "212",
			"number": 1182,
			"departure": 1489658520,
			"delay": 0,
			"live": false,
			"departureISO": "2017-03-16T11:02:00+01:00",
			"destination": "Luxembourg, Monterey Parc",
			"destinationId": 200405004
		}]
    }
}
```

## License
Please refer to [StopPoint/Departures](/Streaming_APIs/StopPoint/departures.md#license) for information about the train and bus departures data licensing.
{% endblock %}
