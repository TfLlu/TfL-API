export default (swlon, swlat, nelon, nelat, lon, lat) => {
    return (
            lon >= swlon && lon <= nelon
        &&  lat >= swlat && lat <= nelat
    );
};
