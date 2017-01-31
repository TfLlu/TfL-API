# BikePoint
The following [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API endpoints offer access to the data of shared bike points flowing through Transport for Luxembourg.
Currently we're providing data from [Vel'oh](https://developer.jcdecaux.com/#/opendata/vls) and [Vel'ok](http://www.velok.lu/).

## License
The data from [Vel'oh](https://developer.jcdecaux.com/#/opendata/vls) is licensed under [CC-BY 2.0](https://creativecommons.org/licenses/by/2.0/).<br />
The data from [Vel'ok](http://www.velok.lu/) is still unlicensed.

## Available endpoints
- [GET BikePoint](/RESTAPIs/BikePoint/index.md)
- [GET BikePoint/{ID}](/RESTAPIs/BikePoint/id.md)
- [GET BikePoint/box/{swLon}/{swLat}/{neLon}/{neLat}](/RESTAPIs/BikePoint/box.md)
- [GET BikePoint/around/{lon}/{lat}/{radius}](/RESTAPIs/BikePoint/around.md)
- [GET BikePoint/Search/{query}](/RESTAPIs/BikePoint/search.md)
