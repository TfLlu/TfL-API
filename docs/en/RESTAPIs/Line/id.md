{% extends "/docs.md" %}
{% block content %}
# GET Line/{ID}
Returns a single line requested by the ID parameter.

## Resource URL
    https://api.tfl.lu/v1/Line/{ID}

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
**GET** https://api.tfl.lu/v1/Line/3:CFLBUS:192
```json
{
	"id": "3:CFLBUS:192",
	"type": "bus",
	"name": "192",
	"long_name": "Kirchberg, Rehazenter - Hassel, Küneftchen"
}
```

## License
Please refer to [Line](/RESTAPIs/Line.md#license) for information about the line data licensing.
{% endblock %}
