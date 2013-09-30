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
    answerJson: {"status":"OK","data":{"result":null}}    
});

test({
    url: '/admin.model:login/?login=test&pass=test',
    text: 'not right login: ',
    answerJson: {"status":"OK","data":null}    
});

describe('GET /admin.model:login/?login=yeti&pass=111111', function () {
    it('right login', function (done) {
        request(app)
        .get('/admin.model:login/?login=yeti&pass=111111')
        .end(function (err, res) {
            if (err) return done(err);
            var x = JSON.parse(res.text)
            x.data.should.have.property('id');
            x.data.should.have.property('token');
            x.data.should.have.property('user');
            done();
        });
    })
})



