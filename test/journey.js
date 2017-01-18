//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/index').default;
chai.should();

chai.use(chaiHttp);

describe('Journey', () => {
    describe('GET /Journey/49.59744,6.14077/to/49.542,6.19942', () => {
        it('should get a journey from Bonnevoie to Weiler-la-tour', (done) => {
            chai.request(server)
                .get('/Journey/49.59744,6.14077/to/49.542,6.19942')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.plan.itineraries.should.be.a('array');
                    done();
                });
        });
    });
});
