{% extends "/docs.md" %}
{% block content %}
# Line
The following [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API endpoints offer access to the lines flowing through Transport for Luxembourg.
Currently we're providing data from [Verkéiersverbond](https://data.public.lu/en/organizations/mobiliteitszentral/) processed by [OpenOV](http://openov.nl/).

## License
The data from [Verkéiersverbond](https://data.public.lu/en/organizations/mobiliteitszentral/) is licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

## Available endpoints
- [GET Line](/RESTAPIs/Line/index.md)
- [GET Line/{ID}](/RESTAPIs/Line/id.md)
- [GET Line/{ID}/StopPoints](/RESTAPIs/Line/Id/stoppoints.md)
- [GET Line/Mode/{Mode}](/RESTAPIs/Line/Mode/mode.md)
- [GET Line/Mode/{Mode}/Route](/RESTAPIs/Line/Mode/mode.md)
- [GET Line/Route](/RESTAPIs/Line/Route/index.md)
- [GET Line/{Line}/Route](/RESTAPIs/Line/Route/line.md)

{% endblock %}
