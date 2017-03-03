{% extends "/docs.md" %}
{% block content %}
# GET Line/Mode/{Mode}/Route
Returns all lines from Luxembourg of a specific mode with their route.

## Resource URL
    https://api.tfl.lu/v1/Line/Mode/{Mode}/Route

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
| Key            | Type     | Possible values | Description  |
| -------------  | -------- | --------------- | ------------ |
| **id**         | `string` | `{id}`          | id of line   |
| **type**       | `string` | - `tram`<br />- `subway`<br />- `train`<br />- `bus`<br />- `ferry`<br />- `cable-car`<br />- `gondola`<br />- `funicular` | type of line |
| **name**       | `string` | `{name}`        | name of line |
| **long_name**  | `string` | `{long_name}`   | long name of line (usually the origin and destination of a line) |
| **stopPoints** | `array`  | `{stopPoints}`  | array of stop points where this line stops |

## Sample request & response
**GET** https://api.tfl.lu/v1/Line/Mode/train/Route
```json
[{
	"id": "2:C88---:CRE7100",
	"type": "train",
	"name": "CRE7100",
	"long_name": "Virton - Luxembourg, Gare Centrale",
	"stopPoints": [
		300000046,
		300000033,
		300000017,
		220903008,
		220902006,
		190101011,
		190301004,
		200415004,
		200405035
	]
}, {
	"id": "2:C82---:RB5100",
	"type": "train",
	"name": "RB5100",
	"long_name": "Trier, Hauptbahnhof - Luxembourg, Gare Centrale",
	"stopPoints": [
		500000079,
		500000084,
		500000028,
		500000019,
		180703003,
		180701004,
		180603001,
		180207004,
		180103002,
		180106003,
		200701001,
		200204001,
		200601013,
		200406009,
		200405035
	]
}, {
	"id": "2:C82---:CRE1800",
	"type": "train",
	"name": "CRE1800",
	"long_name": "Wiltz, Gare - Kautenbach, Gare",
	"stopPoints": [
		120603002,
		120604001,
		120903018
	]
}, {
	"id": "2:C82---:RB5900",
	"type": "train",
	"name": "RB5900",
	"long_name": "Luxembourg, Gare Centrale - Arlon, Gare",
	"stopPoints": [
		200405035,
		200101007,
		190903008,
		190901001,
		191103002,
		300000003,
		190903011
	]
}, {
    ...
}]
```

## License
Please refer to [Line](/RESTAPIs/Line.md#license) for information about the line data licensing.
{% endblock %}
