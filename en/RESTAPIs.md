{% extends "/docs.md" %}
{% block content %}
# REST APIs
The REST APIs provide programmatic access to read Transport for Luxembourg data. Read carpark occupancy data, upcoming bus/train departures from a stop point, and more. All responses are in [JSON](https://en.wikipedia.org/wiki/JSON) format.

If your intention is to monitor or process our data in real-time, consider using the [Streaming APIs](/StreamingAPIs.md) instead.

## Endpoints
Below are some documents that will help you get going with the REST APIs as quickly as possible:

- [BikePoint](/RESTAPIs/BikePoint.md)
- [StopPoint](/RESTAPIs/StopPoint.md)
- [StopPoint/Departures](/RESTAPIs/StopPoint/Departures.md)
- [Journey](/RESTAPIs/StopPoint/Departures.md)
- [Occupancy](/RESTAPIs/Occupancy.md)
- [Weather](/RESTAPIs/Weather.md)

## Feedback
If you find any issues with the REST API, please notify us via [Twitter](https://twitter.com/TfLlu) or [email](mailto:tfl@ion.lu) where we’ll be actively listening to your feedback. We look forward to working with you, and can’t wait to see what everyone builds!
{% endblock %}
