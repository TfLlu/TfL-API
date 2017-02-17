{% extends "/docs.md" %}
{% block content %}
# BikePoint
The following [Straming](https://en.wikipedia.org/wiki/WebSocket) API channels offer access to live data of shared bike points flowing through Transport for Luxembourg in real time.
Currently we're providing data from [Vel'oh](https://developer.jcdecaux.com/#/opendata/vls) and [Vel'ok](http://www.velok.lu/).

## License
The data from [Vel'oh](https://developer.jcdecaux.com/#/opendata/vls) is licensed under [CC-BY 2.0](https://creativecommons.org/licenses/by/2.0/) &copy; JCDecaux.<br />
The data from [Vel'ok](http://www.velok.lu/) is still unlicensed.

## Available channels
- [/BikePoint](/RESTAPIs/BikePoint/index.md)
- [/BikePoint/{ID}](/RESTAPIs/BikePoint/id.md)
{% endblock %}
