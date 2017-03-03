{% extends "/docs.md" %}
{% block content %}
# GET Line/Route
Returns all lines with their route from Luxembourg integrated in Transport for Luxembourg.

## Resource URL
    https://api.tfl.lu/v1/Line/Route

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
| Key           | Type      | Possible values | Description |
| ------------- | --------- | --------------- | ----------- |
| **id**        | `string`  | `{id}`          | id of line |
| **type**      | `string`  | - `tram`<br />- `subway`<br />- `train`<br />- `bus`<br />- `ferry`<br />- `cable-car`<br />- `gondola`<br />- `funicular` | type of line |
| **name**      | `string`  | `{name}`        | name of line |
| **long_name** | `string`  | `{long_name}`   | long name of line (usually the origin and destination of a line) |
| **stopPoints** | `array`  | `{stopPoints}`  | array of stop points where this line stops |

## Sample request & response
**GET** https://api.tfl.lu/v1/Line/Route
```json
[{
	"id": "3:RGTR--:689",
	"type": "bus",
	"name": "689",
	"long_name": "Hautbellain - Troisvierges, Gare",
	"stopPoints": [
		110604001,
		110601003,
		110601001,
		110601002,
		110606004,
		110606006,
		110606002,
		110606003,
		110606001,
		110605004
	]
}, {
	"id": "3:CFLBUS:185",
	"type": "bus",
	"name": "185",
	"long_name": "Schwebsingen, Centre - Ellenger Gare",
	"stopPoints": [
		211002001,
		211002002,
		210603001,
		210601001,
		210601003,
		210601002,
		210602004,
		210602001,
		210602002,
		210602003,
		210602005,
		210201002,
		210201001,
		210201003,
		210202002,
		210202001,
		210202003,
		210502001
	]
}, {
	"id": "3:RGTR--:565",
	"type": "bus",
	"name": "565",
	"long_name": "Ettelbruck, Lycée technique - Mont St. Nicolas",
	"stopPoints": [
		140701023,
		140701024,
		140701016,
		140602008,
		140603002,
		140401008,
		140401004,
		140401001,
		140401007,
		140203002,
		140203001,
		140202001,
		140205002,
		140205001,
		130201002,
		130201003,
		130201001,
		130203003,
		130203002,
		130203001,
		130105002,
		130104001,
		130104002,
		130108003,
		130301001,
		130203005,
		140401006
	]
}, {
    ...
}]
```

## License
Please refer to [Line](/RESTAPIs/Line.md#license) for information about the line data licensing.
{% endblock %}
