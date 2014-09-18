/**
 * Модель
 * 
 * Функции авторизации, регистрации
 * и управления пользовательскими
 * профилями 
 */
var crypto = require('crypto')

exports.Plugin = function(server) {
    this.db = server.inits.db;
    this.server = server;
}
 
/**
 * Общая функция проверки авторизации
 * collectionName - имя коллекции профилей 
 * find - поисковый объект, ex: {login: 'tester'}
 * pass - строка пароля
 * callback - функция
 **/
exports.Plugin.prototype.getAutorization = function(collectionName, find, pass, callback, exp, privat) {

    var collection = this.db.collection(collectionName)
        ,mail = this.server.inits.mail
        ,config = this.server.config
        ,mem = this.server.inits.mem
    
    collection.findOne(find, function(e, r) {
        if(r) {
            
            if(r.activated === false) {
                callback({status: 'blocked'})
                return;
            }
            
            if(privat || r.pass == crypto.createHash(config.HASH_ALG).update(pass).digest('hex')) {
                // login success
                
                // generate token and put it into memcoache
                crypto.randomBytes(config.TOKEN.len, function(ex, buf) {
                    var token = buf.toString('hex')
                        ,lifetime = config.TOKEN.lifetime
                        
                    if(exp == 'true')  lifetime = 30*86400 // секунд в месяце
                    
                    mem.set(token, r._id, function(er, res) {
                        if(res=='STORED') { 
                            // if good   
                    
                            if(r.email && r.dblauth) {
                    
                                // if needed dbl authorisation, making session pass and sending it      
                                crypto.randomBytes(config.TOKEN.sessPassLen, function(ex, buf) {
                                    var sess = buf.toString('hex');
                                    mem.set(token, sess, function(er, res) {
                        
                                        if(res=='STORED') {
                                            mail.sendMail({
                                                from: config.MAIL.from,
                                                to: r.email,
                                                subject: config.MAIL.loginAuthSubject,
                                                text: config.MAIL.loginAuthBody.replace('${pass}', sess)
                                            });
                                            callback({id: r._id, token: token, dblauth: true}, null); 
                                        } else {
                                            callback(null, {code: 500}); // if memcache error
                                        }
                                    }, config.TOKEN.lifetime);
                                });
                            } else {
                                callback({id: r._id, token: token, dblauth: false, user: r}, null); 
                            }
                        
                        } else 
                            callback(null, {mess: 500}); // if memcache error
                    }, lifetime);
                    
                });    
                
            } else {
                // login fault
                callback(null, {code: 401});
            }
        } else callback(null, e);        
    }) 
}

