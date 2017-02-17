export default (lonOrLat) => {
    return Math.round(57.29577951 * parseFloat(lonOrLat.replace(',','.')) * 1000000) / 1000000
    ;
};
