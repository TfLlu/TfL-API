{% extends "/docs.md" %}
{% block content %}
# Occupancy
The following [Straming](https://en.wikipedia.org/wiki/WebSocket) API channels offer access to live data of the occupation status of carparks flowing through Transport for Luxembourg in real time.
Currently we're providing data from [Ville de Luxembourg](https://data.public.lu/en/organizations/ville-de-luxembourg/)'s car parks only. We hope to be able to integrate occupancy of buses running in Luxembourg city soon.

## License
The data from [Ville de Luxembourg](https://data.public.lu/en/organizations/ville-de-luxembourg/) is licensed under [CC-BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en).

## Available channels
- [/Occupancy/CarPark](/RESTAPIs/Occupancy/CarPark/index.md)
- [/Occupancy/CarPark/{id}](/RESTAPIs/Occupancy/CarPark/id.md)
{% endblock %}
