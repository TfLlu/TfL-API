{% extends "/docs.md" %}
{% block content %}
# GET Occupancy/CarPark
Returns the current state of all carparks integrated in Transport for Luxembourg.

## Resource URL
    https://api.tfl.lu/v1/Occupancy/CarPark

## Format
The response will be formatted as a [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) [Feature Collection](http://geojson.org/geojson-spec.html#feature-collection-objects).

## Object properties
| Key       | Type      | Possible values                                    | Description |
| --------- | --------- | -------------------------------------------------- | ----------- |
| **id**    | `string`  | - `{id}`                                           | id of car park |
| **name**  | `string`  | - `{name}`                                         | name of the car park (often a [POI](https://en.wikipedia.org/wiki/Point_of_interest) next to it or the street name) |
| **total** | `integer` | - `{total}`<br />- `NULL`                          | total amount of parking spots at this car park, _can be null_ |
| **free**  | `integer` | - `{free}`<br />- `NULL`                           | amount of free parking spots at this car park, _can be null_ |
| **trend** | `string`  | - `down`<br />- `stable`<br />- `up`<br />- `NULL` | trend of parking spots in use (up means fewer free spaces than previously [the timing of this is not known]), _can be null_ |
| **meta**  | `object`  | - `object`<br />- `NULL`                           | meta data about the carpark (the reason for putting stuff here is to have a global occupancy endpoint that returns the same values wether it's a car park, a bus or anything else), _can be null_ |

### Meta properties (carPark)
_**All the following values can be null**_

| Key                              | Type       | Possible values                                    | Description |
| -------------------------------- | ---------- | -------------------------------------------------- | ----------- |
| **open**                         | `boolean`  | - `true`<br />- `false`     | id of car park |
| **elevator**                     | `boolean`  | - `true`<br />- `false`     | wether there is an elevator or not |
| **link**                         | `string`   | - `{link}`                  | Link to an extensive page about this carpark |
| **address**                      | `object`   | - `object`                  |  |
| **address.street**               | `string`   | - `{street}`                | Address of carpark entry |
| **address.exit**                 | `string`   | - `{exit}`                  | Address of carpark exit |
| **phone**                        | `integer`  | - `{phone}`                 | Phone number of carpark |
| **reserved_for_disabled**        | `integer`  | - `{reserved_for_disabled}` | Amount of car spaces reserved for disabled people |
| **reserved_for_women**           | `integer`  | - `{reserved_for_women}`    | Amount of car spaces reserved for women |
| **motorbike_lots**               | `integer`  | - `{motorbike_lots}`        | Amount of car spaces reserved for motorbikes |
| **bus_lots**                     | `integer`  | - `{bus_lots}`              | Amount of car spaces reserved for busses |
| **bicycle_docks**                | `integer`  | - `{bicycle_docks}`         | Amount of car spaces reserved for bicycles |
| **payment_methods**              | `object`   | - `object`                  |  |
| **payment_methods.cash**         | `boolean`  | - `{cash}`                  | Wether you can pay with cash or not |
| **payment_methods.vpay**         | `boolean`  | - `{vpay}`                  | Wether you can pay with vpay or not |
| **payment_methods.visa**         | `boolean`  | - `{visa}`                  | Wether you can pay with visa or not |
| **payment_methods.mastercard**   | `boolean`  | - `{mastercard}`            | Wether you can pay with mastercard or not |
| **payment_methods.eurocard**     | `boolean`  | - `{eurocard}`              | Wether you can pay with eurocard or not |
| **payment_methods.amex**         | `boolean`  | - `{amex}`                  | Wether you can pay with amex or not |
| **payment_methods.call2park**    | `boolean`  | - `{call2park}`             | Wether you can pay with call2park or not |
| **restrictions**                 | `object`   | - `object`                  |  |
| **restrictions.allowed_gpl**     | `boolean`  | - `true`<br />- `false`     | Wether you are allowed tp park a car running on gpl or not |
| **restrictions.allowed_trailor** | `boolean`  | - `true`<br />- `false`     | Wether you are allowed tp park a car with a trailor or not |
| **restrictions.allowed_truck**   | `boolean`  | - `true`<br />- `false`     | Wether you are allowed tp park a truck or not |
| **restrictions.max_height**      | `float`    | - `{max_height}`            | Maximum vehicle height allowed |

## Sample request & response
**GET** https://api.tfl.lu/v1/Occupancy/CarPark
```json
{
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [6.1414, 49.6119]
		},
		"properties": {
			"id": "vdl:29",
			"name": "Brasserie",
			"total": 270,
			"free": 228,
			"trend": "down",
			"meta": {
				"open": true,
				"elevator": true,
				"link": "http://service.vdl.lu/export/circulation_guidageparking.php?vdl_f=detail&vdl_id=29",
				"address": {
					"street": "2 rue Emile Mousel",
					"exit": "2 rue Emile Mousel"
				},
				"phone": 26478290,
				"reserved_for_disabled": 4,
				"reserved_for_women": 0,
				"motorbike_lots": 4,
				"bus_lots": 0,
				"bicycle_docks": 0,
				"payment_methods": {
					"cash": true,
					"vpay": false,
					"visa": true,
					"mastercard": true,
					"eurocard": true,
					"amex": true,
					"call2park": false
				},
				"restrictions": {
					"allowed_gpl": true,
					"allowed_trailor": true,
					"allowed_truck": true,
					"max_height": 2
				}
			}
		}
	}, {
        ...
    }]
}
```

## License
Please refer to [Occupancy](/RESTAPIs/Occupancy.md#license) for information about the train and bus stop data licensing.
{% endblock %}
