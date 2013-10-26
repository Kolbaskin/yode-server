var request = require('request')
    ,auth = require('./auth')

if(!process.argv[2]) return;

request.post(process.argv[2] + '/search.engine:getXml/', {
    form: {
        login: auth.login,
        pass: auth.pass
    }
}, function(e, r, body) {
    console.log(body)
})