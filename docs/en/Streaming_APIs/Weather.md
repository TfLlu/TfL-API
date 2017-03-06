{% extends "/docs.md" %}
{% block content %}
# Weather
The following [Straming](https://en.wikipedia.org/wiki/WebSocket) API channels offer access to live weather data flowing through Transport for Luxembourg in real time.
Currently we're providing data from [MeteoLux](https://data.public.lu/en/organizations/meteolux/) and [Administration de l'Environnement](http://www.environnement.public.lu/).

## License
The data from [MeteoLux](https://data.public.lu/en/organizations/meteolux/) is licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).<br />
The data from [Administration de l'Environnement](http://www.environnement.public.lu/) is licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

## Available channels
- [/Weather](/Streaming_APIs/Weather/index.md)
- [Weather/AirQuality](/Streaming_APIs/Weather/airquality.md)
{% endblock %}
