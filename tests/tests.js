var request = require('supertest')
    ,server = require('../index')

var app

var test = function(obj) {
    var ans
    if(obj.answerJson) ans = JSON.stringify(obj.answerJson)
    if(obj.answer) ans = obj.answer
    
    if(!obj.text) obj.text = 'should contain: '
    
    describe('GET ' + obj.url, function () {
        it(obj.text + ans, function (done) {
            request(app)
            .get(obj.url)
            .expect(ans, done)
        })    
    })
}

/**
 * 
 * Setup server for tests
 * 
 */

describe('GET /admin.model:test/', function () {

    before(function (done) {                
        server.start({projects_dir: '../../www'}, function(httpServer) {
            app = httpServer
            setTimeout(function() {done();}, 2000) // подождем пока все загрузится
        }, true)
    });

    it('should contain json: ' + '{"status":"OK","data":{"result":null}}', function (done) {
        request(app)
        .get('/admin.model:test/')
        .expect('{"status":"OK","data":{"result":null}}', done)
    })

})

/**
 * 
 * Models testing
 * 
 */

test({
    url: '/admin.model:test/',
    text: 'authorisation fault: ',
    answerJson: {"status":"OK","data":{"result":null}}    
});

test({
    url: '/admin.model:login/?login=test&pass=test',
    text: 'not right login: ',
    answerJson: {"status":"OK","data":null}    
});

var sess_params;

describe('GET /admin.model:login/?login=yeti&pass=111111', function () {
    it('right login', function (done) {
        request(app)
        .get('/admin.model:login/?login=yeti&pass=111111')
        .end(function (err, res) {
            if (err) return done(err);
            var x = JSON.parse(res.text)
            
            sess_params = 'id=' + x.data.id + '&token=' + x.data.token
                        
            
            x.data.should.have.property('id');
            x.data.should.have.property('token');
            x.data.should.have.property('user');
            done();
        });
    })
})

/**
 * 
 * Data functions
 * 
 */

describe('GET /admin.model:test/?id=<sess_id>&token=<sess_token>', function () {
    it('right test authorisation', function (done) {
        request(app)
        .get('/admin.model:test/?' + sess_params)
        .end(function (err, res) {
            if (err) return done(err);
            var x = JSON.parse(res.text)
            x.data.should.be.ok;
            done();
        });
    })
})
 
describe('GET /admin.model:getdata/MyDesktop.modules.users.model.UsersModel/', function () {
    it('get full data from model', function (done) {
      
        request(app)
        .get('/admin.model:getdata/MyDesktop.modules.users.model.UsersModel/?' + sess_params)
        .end(function (err, res) {

            if (err) return done(err);
            var x = JSON.parse(res.text)            
            x.data.should.have.property('total');
            x.data.should.have.property('list');
            x.data.success.should.be.true;            
            done();
        });
    })
})

describe('GET /admin.model:getdata/MyDesktop.modules.users.model.UsersModel/?start=0&limit=1', function () {
    it('paging test', function (done) {
      
        request(app)
        .get('/admin.model:getdata/MyDesktop.modules.users.model.UsersModel/?start=0&limit=1&' + sess_params)
        .end(function (err, res) {

            if (err) return done(err);
            var x = JSON.parse(res.text)            
            x.data.total.should.equal(1);
            x.data.should.have.property('list');
            x.data.success.should.be.true;            
            done();
        });
    })
})

describe('GET /admin.model:getdata/MyDesktop.modules.users.model.UsersModel/?query=yeti', function () {
    it('searching test', function (done) {
      
        request(app)
        .get('/admin.model:getdata/MyDesktop.modules.users.model.UsersModel/?query=yeti&' + sess_params)
        .end(function (err, res) {

            if (err) return done(err);
            var x = JSON.parse(res.text)            
            x.data.total.should.equal(1);
            x.data.should.have.property('list');
            x.data.success.should.be.true;            
            done();
        });
    })
})

describe('GET /admin.model:getdata/MyDesktop.modules.users.model.UsersModel/?query=[{"property":"login", "value":"yeti", "operator": "eq"}]', function () {
    it('filters test (equal)', function (done) {
      
        request(app)
        .get('/admin.model:getdata/MyDesktop.modules.users.model.UsersModel/?query=' +
            encodeURIComponent(JSON.stringify([{property:"login", value:"yeti", operator: "eq"}])) +
            '&' + sess_params)
        .end(function (err, res) {

            if (err) return done(err);
            var x = JSON.parse(res.text)            
            x.data.total.should.equal(1);
            x.data.should.have.property('list');
            x.data.success.should.be.true;            
            done();
        });
    })
})

describe('GET /admin.model:getdata/MyDesktop.modules.users.model.UsersModel/?query=[{"property":"login", "value":"yet", "operator": "like", type: "string"}]', function () {
    it('filters test (like)', function (done) {
      
        request(app)
        .get('/admin.model:getdata/MyDesktop.modules.users.model.UsersModel/?query=' +
            encodeURIComponent(JSON.stringify([{property:"login", value:"yet", operator: "like", type: "string"}])) +
            '&' + sess_params)
        .end(function (err, res) {

            if (err) return done(err);
            var x = JSON.parse(res.text)            
            x.data.total.should.equal(1);
            x.data.should.have.property('list');
            x.data.success.should.be.true;            
            done();
        });
    })
})
