{% extends "/docs.md" %}
{% block content %}
# Occupancy
The following [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API endpoints offer access to the occupation status of carparks data flowing through Transport for Luxembourg.
Currently we're providing data from [Ville de Luxembourg](https://data.public.lu/en/organizations/ville-de-luxembourg/)'s car parks only. We hope to be able to integrate occupancy of buses running in Luxembourg city soon.

## License
The data from [Ville de Luxembourg](https://data.public.lu/en/organizations/ville-de-luxembourg/) is licensed under [CC-BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en).

## Available endpoints
- [GET Occupancy/CarPark](/RESTAPIs/Occupancy/CarPark/index.md)
- [GET Occupancy/CarPark/{id}](/RESTAPIs/Occupancy/CarPark/id.md)
{% endblock %}
