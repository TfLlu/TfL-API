//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/index').default;
chai.should();
let geojsonValidation = require('geojson-validation');

chai.use(chaiHttp);

describe('Weather', () => {
    describe('GET /Weather', () => {
        it('should get current weather conditions', (done) => {
            chai.request(server)
                .get('/Weather')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    var location = res.body;
                    location.coord.lon.should.be.a('Number');
                    location.coord.lat.should.be.a('Number');
                    location.weather.should.be.a('array');
                    location.weather[0].description.should.be.a('String');
                    location.main.temp.should.be.a('Number');
                    location.main.pressure.should.be.a('Number');
                    location.main.humidity.should.be.a('Number');
                    location.visibility.should.be.a('Number');
                    location.wind.speed.should.be.a('Number');
                    location.wind.deg.should.be.a('Number');
                    location.dt.should.be.a('Number');
                    location.name.should.be.a('String');
                    location.cod.should.be.a('Number');
                    done();
                });
        });
    });

    describe('GET /Weather/Airqulity', () => {
        it('should get current airquality conditions', (done) => {
            chai.request(server)
                .get('/Weather/Airquality')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    geojsonValidation.isFeatureCollection(res.body).should.be.equal(true);
                    for(var i = 0; i < res.body.features.length; i++) {
                        var props = res.body.features[i].properties;
                        props.id.should.be.a('String');
                        props.name.should.be.a('String');
                        if (props.temp !== null) {
                            props.temp.should.be.a('Number');
                        }
                        if (props.pm10 !== null) {
                            props.pm10.should.be.a('Number');
                        }
                        if (props.no2 !== null) {
                            props.no2.should.be.a('Number');
                        }
                        if (props.o3 !== null) {
                            props.o3.should.be.a('Number');
                        }
                        if (props.so2 !== null) {
                            props.so2.should.be.a('Number');
                        }
                        if (props.co !== null) {
                            props.co.should.be.a('Number');
                        }
                    }
                    done();
                });
        });
    });
    describe('GET /Weather/Airqulity/aev:Lux-Bonnevoie', () => {
        it('should get current airquality conditions from Bonnevoie', (done) => {
            chai.request(server)
                .get('/Weather/Airquality/aev:Lux-Bonnevoie')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    geojsonValidation.isFeature(res.body).should.be.equal(true);
                    var props = res.body.properties;
                    props.id.should.be.a('String');
                    props.id.should.be.equal('aev:Lux-Bonnevoie');
                    props.name.should.be.a('String');
                    props.name.should.be.equal('Lux-Bonnevoie');
                    if (props.temp !== null) {
                        props.temp.should.be.a('Number');
                    }
                    if (props.pm10 !== null) {
                        props.pm10.should.be.a('Number');
                    }
                    if (props.no2 !== null) {
                        props.no2.should.be.a('Number');
                    }
                    if (props.o3 !== null) {
                        props.o3.should.be.a('Number');
                    }
                    if (props.so2 !== null) {
                        props.so2.should.be.a('Number');
                    }
                    if (props.co !== null) {
                        props.co.should.be.a('Number');
                    }
                    done();
                });
        });
    });
});
