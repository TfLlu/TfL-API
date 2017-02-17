{% extends "/docs.md" %}
{% block content %}
# StopPoint/Departures
The following [Straming](https://en.wikipedia.org/wiki/WebSocket) API channels offer access to live data of train and bus departures flowing through Transport for Luxembourg in real time.
Currently we're providing data from the [Verkéiersverbond](https://data.public.lu/en/organizations/mobiliteitszentral/) only.

## License
The data from [Verkéiersverbond](https://data.public.lu/en/organizations/mobiliteitszentral/) is licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

## Available channels
- [/StopPoint/Departures](/Streaming_APIs/StopPoint/Departures/index.md)
- [/StopPoint/Departures/{id}](/Streaming_APIs/StopPoint/Departures/id.md)
{% endblock %}
