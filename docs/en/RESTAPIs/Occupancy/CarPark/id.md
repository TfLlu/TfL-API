{% extends "/docs.md" %}
{% block content %}
# GET Occupancy/CarPark/{ID}
Returns a single bus and/or train stop requested by the ID parameter.

## Parameters
| Parameter         | Example value                   | Description |
| ----------------- | ------------------------------- | ----------- |
| **id** | `vdl:22` | Id `string` of car park as found in [`/Occupancy/CarPark`](/RESTAPIs/Occupancy/CarPark/index.md) |

## Resource URL
    https://api.tfl.lu/v1/Occupancy/CarPark/{ID}

## Format
The response will be formatted as a [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) [Feature](http://geojson.org/geojson-spec.html#feature-objects).

## Object properties
| Key       | Type      | Possible values                                    | Description |
| --------- | --------- | -------------------------------------------------- | ----------- |
| **id**    | `string`  | `{id}`                                             | id of car park |
| **name**  | `string`  | `{name}`                                           | name of the car park (often a [POI](https://en.wikipedia.org/wiki/Point_of_interest) next to it or the street name) |
| **total** | `integer` | <nobr>- `{total}`</nobr><br /><nobr>- `NULL`</nobr>                          | total amount of parking spots at this car park, _can be null_ |
| **free**  | `integer` | - `{free}`<br />- `NULL`                           | amount of free parking spots at this car park, _can be null_ |
| **trend** | `string`  | <nobr>- `'down'`</nobr><br /><nobr>- `'stable'`</nobr><br /><nobr>- `'up'`</nobr><br /><nobr>- `NULL`</nobr> | trend of parking spots in use (up means fewer free spaces than previously [the timing of this is not known]), _can be null_ |
| **meta**  | `object`  | - `object`<br />- `NULL`                           | meta data about the carpark (the reason for putting stuff here is to have a global occupancy endpoint that returns the same values wether it's a car park, a bus or anything else), _can be null_ |

### Meta properties (carPark)
_**All the following values can be null**_

| Key                              | Type       | Possible values                                    | Description |
| -------------------------------- | ---------- | -------------------------------------------------- | ----------- |
| **open**                         | `boolean`  | - `true`<br />- `false`     | id of car park |
| **elevator**                     | `boolean`  | - `true`<br />- `false`     | wether there is an elevator or not |
| **link**                         | `string`   | `{link}`                    | Link to an extensive page about this carpark |
| **address**                      | `object`   | `object`                    |  |
| **address.street**               | `string`   | `{street}`                  | Address of carpark entry |
| **address.exit**                 | `string`   | `{exit}`                    | Address of carpark exit |
| **phone**                        | `integer`  | `{phone}`                   | Phone number of carpark |
| **reserved_for_disabled**        | `integer`  | `{reserved_for_disabled}`   | Amount of car spaces reserved for disabled people |
| **reserved_for_women**           | `integer`  | `{reserved_for_women}`      | Amount of car spaces reserved for women |
| **motorbike_lots**               | `integer`  | `{motorbike_lots}`          | Amount of car spaces reserved for motorbikes |
| **bus_lots**                     | `integer`  | `{bus_lots}`                | Amount of car spaces reserved for busses |
| **bicycle_docks**                | `integer`  | `{bicycle_docks}`           | Amount of car spaces reserved for bicycles |
| **payment_methods**              | `object`   | `object`                    |  |
| **payment_methods.cash**         | `boolean`  | `{cash}`                    | Wether you can pay with cash or not |
| **payment_methods.vpay**         | `boolean`  | `{vpay}`                    | Wether you can pay with vpay or not |
| **payment_methods.visa**         | `boolean`  | `{visa}`                    | Wether you can pay with visa or not |
| **payment_methods.mastercard**   | `boolean`  | `{mastercard}`              | Wether you can pay with mastercard or not |
| **payment_methods.eurocard**     | `boolean`  | `{eurocard}`                | Wether you can pay with eurocard or not |
| **payment_methods.amex**         | `boolean`  | `{amex}`                    | Wether you can pay with amex or not |
| **payment_methods.call2park**    | `boolean`  | `{call2park}`               | Wether you can pay with call2park or not |
| **restrictions**                 | `object`   | `object`                    |  |
| **restrictions.allowed_gpl**     | `boolean`  | - `true`<br />- `false`     | Wether you are allowed tp park a car running on gpl or not |
| **restrictions.allowed_trailor** | `boolean`  | - `true`<br />- `false`     | Wether you are allowed tp park a car with a trailor or not |
| **restrictions.allowed_truck**   | `boolean`  | - `true`<br />- `false`     | Wether you are allowed tp park a truck or not |
| **restrictions.max_height**      | `float`    | `{max_height}`              | Maximum vehicle height allowed |

## Sample request & response
**GET** https://api.tfl.lu/v1/Occupancy/CarPark/vdl:22
```json
{
	"type": "Feature",
	"geometry": {
		"type": "Point",
		"coordinates": [6.12217, 49.61583]
	},
	"properties": {
		"id": "vdl:22",
		"name": "Glacis",
		"total": 1007,
		"free": 72,
		"trend": "down",
		"meta": {
			"open": true,
			"elevator": false,
			"link": "http://service.vdl.lu/export/circulation_guidageparking.php?vdl_f=detail&vdl_id=22",
			"address": {
				"street": "21 Allée Scheffer, L-2520 Luxembourg",
				"exit": "Avenue de la Faïencerie, L-1510 Luxembourg.\r\nAllée Scheffer, L-2520 Luxembourg."
			},
			"phone": null,
			"reserved_for_disabled": 6,
			"reserved_for_women": 0,
			"motorbike_lots": 11,
			"bus_lots": 50,
			"bicycle_docks": 10,
			"payment_methods": {
				"cash": true,
				"vpay": false,
				"visa": false,
				"mastercard": false,
				"eurocard": false,
				"amex": false,
				"call2park": true
			},
			"restrictions": {
				"allowed_gpl": false,
				"allowed_trailor": true,
				"allowed_truck": true,
				"max_height": null
			}
		}
	}
}
```

## License
Please refer to [Occupancy](/RESTAPIs/Occupancy.md#license) for information about the occupancy data licensing.
{% endblock %}
