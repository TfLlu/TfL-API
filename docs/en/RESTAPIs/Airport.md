{% extends "/docs.md" %}
{% block content %}
# Airport
The following [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API endpoints offer access to the plane arrivals and departures data flowing through Transport for Luxembourg.
Currently we're providing data from [LuxAirport](https://data.public.lu/en/datasets/arrivees-et-departs-de-laeroport-de-luxembourg/).

## License
The data from [LuxAirport](https://data.public.lu/en/datasets/arrivees-et-departs-de-laeroport-de-luxembourg/) is licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

## Available endpoints
- [GET Airport/Arrivals](/RESTAPIs/Airport/arrivals.md)
- [GET Airport/Departures](/RESTAPIs/Airport/departures.md)
{% endblock %}
