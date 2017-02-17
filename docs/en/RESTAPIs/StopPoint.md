{% extends "/docs.md" %}
{% block content %}
# StopPoint
The following [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API endpoints offer access to the data of bus and trains stops flowing through Transport for Luxembourg.
Currently we're providing data from the [Verkéiersverbond](https://data.public.lu/en/organizations/mobiliteitszentral/) only.

## License
The data from [Verkéiersverbond](https://data.public.lu/en/organizations/mobiliteitszentral/) is licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

## Available endpoints
- [GET StopPoint](/RESTAPIs/StopPoint/index.md)
- [GET StopPoint/{ID}](/RESTAPIs/StopPoint/id.md)
- [GET StopPoint/box/{swLon}/{swLat}/{neLon}/{neLat}](/RESTAPIs/StopPoint/box.md)
- [GET StopPoint/around/{lon}/{lat}/{radius}](/RESTAPIs/StopPoint/around.md)
- [GET StopPoint/Search/{query}](/RESTAPIs/StopPoint/search.md)
- [StopPoint/Departures](/RESTAPIs/StopPoint/departures.md)
{% endblock %}
