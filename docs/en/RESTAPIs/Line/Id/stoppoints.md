{% extends "/docs.md" %}
{% block content %}
# GET Line/{ID}/StopPoints
Returns an array of stop points for a single line requested by the ID parameter.

## Resource URL
    https://api.tfl.lu/v1/Line/{ID}/StopPoints

## Format
The response will be formatted as a [JSON](https://en.wikipedia.org/wiki/JSON).

## Sample request & response
**GET** https://api.tfl.lu/v1/Line/3:CFLBUS:192/StopPoints
```json
[
	200417034,
	200417015,
	200417017,
	200417009,
	200417013,
	200417005,
	200417016,
	200417007,
	200405014,
	200405029,
	200405023,
	200405026,
	200405032,
	200404008,
	200404016,
	200404028,
	200304004,
	200304001,
	200303007,
	200303001,
	200303006,
	200301003,
	200301002,
	201103001,
	201103004,
	201103003,
	201103002,
	201103005,
	201101001,
	201101002,
	201101003,
	200405036,
	200405020,
	200417031,
	200417029,
	200417014,
	200405035
]
```

## License
Please refer to [Line](/RESTAPIs/Line.md#license) for information about the line data licensing.
{% endblock %}
