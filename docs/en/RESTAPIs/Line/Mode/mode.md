{% extends "/docs.md" %}
{% block content %}
# GET Line/Mode/{Mode}
Returns all lines from Luxembourg of a specific mode.

## Resource URL
    https://api.tfl.lu/v1/Line/Mode/{Mode}

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Object properties
| Key           | Type      | Possible values | Description  |
| ------------- | --------- | --------------- | ------------ |
| **id**        | `string`  | `{id}`          | id of line   |
| **type**      | `string`  | - `tram`<br />- `subway`<br />- `train`<br />- `bus`<br />- `ferry`<br />- `cable-car`<br />- `gondola`<br />- `funicular` | type of line |
| **name**      | `string`  | `{name}`        | name of line |
| **long_name** | `string`  | `{long_name}`   | long name of line (usually the origin and destination of a line) |

## Sample request & response
**GET** https://api.tfl.lu/v1/Line/Mode/train
```json
[{
	"id": "2:C88---:CRE7100",
	"type": "train",
	"name": "CRE7100",
	"long_name": "Virton - Luxembourg, Gare Centrale"
}, {
	"id": "2:C82---:RB5100",
	"type": "train",
	"name": "RB5100",
	"long_name": "Trier, Hauptbahnhof - Luxembourg, Gare Centrale"
}, {
	"id": "2:C82---:CRE1800",
	"type": "train",
	"name": "CRE1800",
	"long_name": "Wiltz, Gare - Kautenbach, Gare"
}, {
	"id": "2:C82---:RB5900",
	"type": "train",
	"name": "RB5900",
	"long_name": "Luxembourg, Gare Centrale - Arlon, Gare"
}, {
	"id": "2:C82---:RB3600",
	"type": "train",
	"name": "RB3600",
	"long_name": "Diekirch, Gare - Luxembourg, Gare Centrale"
}, {
    ...
}]
```

## License
Please refer to [Line](/RESTAPIs/Line.md#license) for information about the line data licensing.
{% endblock %}
