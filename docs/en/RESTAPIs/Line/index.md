{% extends "/docs.md" %}
{% block content %}
# GET Line
Returns all lines from Luxembourg integrated in Transport for Luxembourg.

## Resource URL
    https://api.tfl.lu/v1/Line

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
| Key           | Type      | Possible values | Description |
| ------------- | --------- | --------------- | ----------- |
| **id**        | `string`  | `{id}`          | id of line |
| **type**      | `string`  | - `tram`<br />- `subway`<br />- `train`<br />- `bus`<br />- `ferry`<br />- `cable-car`<br />- `gondola`<br />- `funicular` | type of line |
| **name**      | `string`  | `{name}`        | name of line |
| **long_name** | `string`  | `{long_name}`   | long name of line (usually the origin and destination of a line) |

## Sample request & response
**GET** https://api.tfl.lu/v1/Line
```json
[{
	"id": "3:RGTR--:689",
	"type": "bus",
	"name": "689",
	"long_name": "Hautbellain - Troisvierges, Gare"
}, {
	"id": "3:CFLBUS:185",
	"type": "bus",
	"name": "185",
	"long_name": "Schwebsingen, Centre - Ellenger Gare"
}, {
	"id": "3:RGTR--:565",
	"type": "bus",
	"name": "565",
	"long_name": "Ettelbruck, Lycée technique - Mont St. Nicolas"
}, {
	"id": "3:RGTR--:687",
	"type": "bus",
	"name": "687",
	"long_name": "Troisvierges, Gare - Huldange, Schmitt"
}, {
	"id": "1:AVL---:2",
	"type": "bus",
	"name": "2",
	"long_name": "Limpertsberg, Lycée Michel Lucius - Cessange, Boy Konen"
}, {
    ...
}]

```

## License
Please refer to [Line](/RESTAPIs/Line.md#license) for information about the line data licensing.
{% endblock %}
