module.exports = {

    geojson: function(data) {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [data.latitude, data.longitude]
            },
            properties: {
                id: data.id,
                name: data.name
            }
        }
    }

}
