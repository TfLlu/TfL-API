{% extends "/docs.md" %}
{% block content %}
# Weather
The following [Straming](https://en.wikipedia.org/wiki/WebSocket) API endpoints offer access to live highway data flowing through Transport for Luxembourg in real time.
Currently we're providing data from [CITA](http://cita.lu/) only.

## License
The data from [CITA](http://cita.lu/) is still unlicensed.

## Available channels
- [/Highway](/Streaming_APIs/Highway/index.md)
- [/Highway/{ID}](/Streaming_APIs/Highway/id.md)
{% endblock %}
