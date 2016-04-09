module.exports = {

    geojson: function(data) {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [data.longitude, data.latitude]
            },
            properties: {
                id: data.id,
                name: data.name
            }
        }
    }

}
