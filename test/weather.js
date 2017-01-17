//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/index').listen();
chai.should();

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
});
