//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/index').listen();
let should = chai.should();
let geojsonValidation = require('geojson-validation');

chai.use(chaiHttp);

describe('BikePoints', () => {
    describe('GET /BikePoint', () => {
        it('should get all the bikepoints as geojson', (done) => {
            chai.request(server)
                .get('/BikePoint')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    //res.should.have.header('Access-Control-Allow-Origin', '*');
                    res.body.should.be.a('object');
                    geojsonValidation.isFeatureCollection(res.body).should.be.equal(true);
                    var props = res.body.features[0].properties;
                    props.id.should.be.a('String');
                    props.open.should.be.a('Boolean');
                    props.name.should.be.a('String');
                    if (props.city !== null) {
                        props.city.should.be.a('String');
                    }
                    props.address.should.be.a('String');
                    if (props.photo !== null) {
                        props.photo.should.be.a('String');
                    }
                    props.docks.should.be.a('Number');
                    props.available_bikes.should.be.a('Number');
                    props.available_ebikes.should.be.a('Number');
                    props.available_docks.should.be.a('Number');
                    if (props.last_update !== null) {
                        props.last_update.should.be.a('Number');
                    }
                    props.dock_status.should.be.a('array');
                    props.dock_status[0].status.should.be.a('String');
                    if (props.dock_status[0].bikeType !== null) {
                        props.dock_status[0].bikeType.should.be.a('String');
                    }
                    done();
                });
        });
    });
    describe('GET /BikePoint/velok:29', () => {
        it('should get bikepoint 29 from velok provider as geojson', (done) => {
            chai.request(server)
                .get('/BikePoint/velok:29')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    //res.should.have.header('Access-Control-Allow-Origin', '*');
                    res.body.should.be.a('object');
                    geojsonValidation.isFeature(res.body).should.be.equal(true);
                    var props = res.body.properties;
                    props.id.should.be.a('String');
                    props.open.should.be.a('Boolean');
                    props.name.should.be.a('String');
                    if (props.city !== null) {
                        props.city.should.be.a('String');
                    }
                    props.address.should.be.a('String');
                    if (props.photo !== null) {
                        props.photo.should.be.a('String');
                    }
                    props.docks.should.be.a('Number');
                    props.available_bikes.should.be.a('Number');
                    props.available_ebikes.should.be.a('Number');
                    props.available_docks.should.be.a('Number');
                    if (props.last_update !== null) {
                        props.last_update.should.be.a('Number');
                    }
                    props.dock_status.should.be.a('array');
                    props.dock_status[0].status.should.be.a('String');
                    if (props.dock_status[0].bikeType !== null) {
                        props.dock_status[0].bikeType.should.be.a('String');
                    }
                    props.name.should.be.equal('Kulturfabrik');
                    props.id.should.be.equal('velok:29');
                    done();
                });
        });
    });
    describe('GET /BikePoint/box/6.10/49.5/6.11/49.55', () => {
        it('should get bikepoints in bounding box as geojson', (done) => {
            chai.request(server)
                .get('/BikePoint/box/6.10/49.5/6.11/49.55')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    //res.should.have.header('Access-Control-Allow-Origin', '*');
                    res.body.should.be.a('object');
                    geojsonValidation.isFeatureCollection(res.body).should.be.equal(true);
                    res.body.features.length.should.be.within(2,5);
                    var props = res.body.features[0].properties;
                    props.id.should.be.a('String');
                    props.open.should.be.a('Boolean');
                    props.name.should.be.a('String');
                    if (props.city !== null) {
                        props.city.should.be.a('String');
                    }
                    props.address.should.be.a('String');
                    if (props.photo !== null) {
                        props.photo.should.be.a('String');
                    }
                    props.docks.should.be.a('Number');
                    props.available_bikes.should.be.a('Number');
                    props.available_ebikes.should.be.a('Number');
                    props.available_docks.should.be.a('Number');
                    if (props.last_update !== null) {
                        props.last_update.should.be.a('Number');
                    }
                    props.dock_status.should.be.a('array');
                    props.dock_status[0].status.should.be.a('String');
                    if (props.dock_status[0].bikeType !== null) {
                        props.dock_status[0].bikeType.should.be.a('String');
                    }
                    done();
                });
        });
    });
    describe('GET /BikePoint/around/6.133646/49.60067/300', () => {
        it('should get bikepoints around Luxembourg Central station (LON:6.133646 LAT:49.60067 MAX_DISTANCE:500m) as geojson', (done) => {
            chai.request(server)
                .get('/BikePoint/around/6.133646/49.60067/300')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    //res.should.have.header('Access-Control-Allow-Origin', '*');
                    res.body.should.be.a('object');
                    geojsonValidation.isFeatureCollection(res.body).should.be.equal(true);
                    res.body.features.length.should.be.within(1,10);
                    var props = res.body.features[0].properties;
                    props.id.should.be.a('String');
                    props.open.should.be.a('Boolean');
                    props.name.should.be.a('String');
                    if (props.city !== null) {
                        props.city.should.be.a('String');
                    }
                    props.address.should.be.a('String');
                    if (props.photo !== null) {
                        props.photo.should.be.a('String');
                    }
                    props.docks.should.be.a('Number');
                    props.available_bikes.should.be.a('Number');
                    props.available_ebikes.should.be.a('Number');
                    props.available_docks.should.be.a('Number');
                    if (props.last_update !== null) {
                        props.last_update.should.be.a('Number');
                    }
                    props.dock_status.should.be.a('array');
                    props.dock_status[0].status.should.be.a('String');
                    if (props.dock_status[0].bikeType !== null) {
                        props.dock_status[0].bikeType.should.be.a('String');
                    }
                    done();
                });
        });
    });
    describe('GET /BikePoint/Search/Coin Rue de lAlzette', () => {
        it('should get bikepoints where name matches query as geojson', (done) => {
            chai.request(server)
                .get('/BikePoint/Search/Coin%20Rue%20de%20lAlzette')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    //res.should.have.header('Access-Control-Allow-Origin', '*');
                    res.body.should.be.a('object');
                    geojsonValidation.isFeatureCollection(res.body).should.be.equal(true);
                    res.body.features.length.should.be.within(1,10);
                    var props = res.body.features[0].properties;
                    props.id.should.be.a('String');
                    props.open.should.be.a('Boolean');
                    props.name.should.be.a('String');
                    if (props.city !== null) {
                        props.city.should.be.a('String');
                    }
                    props.address.should.be.a('String');
                    if (props.photo !== null) {
                        props.photo.should.be.a('String');
                    }
                    props.docks.should.be.a('Number');
                    props.available_bikes.should.be.a('Number');
                    props.available_ebikes.should.be.a('Number');
                    props.available_docks.should.be.a('Number');
                    if (props.last_update !== null) {
                        props.last_update.should.be.a('Number');
                    }
                    props.dock_status.should.be.a('array');
                    props.dock_status[0].status.should.be.a('String');
                    if (props.dock_status[0].bikeType !== null) {
                        props.dock_status[0].bikeType.should.be.a('String');
                    }
                    done();
                });
        });
    });
});
