/**
 * Модель
 * 
 * управления пользовательскими объявлениями 
 */
var forms = require("forms")

exports.Plugin = function(server) {
    this.db = server.inits.db;
    this.server = server;
}
/**
 * 
 * Создаем жалобу
 * 
 */
exports.Plugin.prototype.mark_as_read = function(req, callback, auth) {
    var me = this
        ,o_id    
    
    if(!auth) {
        callback(null, {code: 401})
        return;
    }    
    
    if(req.urlparams[0]) {
        if((o_id = forms.strToId(req.urlparams[0], callback)) === 0) return;
        
        var collName = 'complaints'
        if(req.urlparams[1]) collName = req.urlparams[1]
        
        me.db.collection(collName).update({_id: o_id}, {$set: {read: true}}, function(e, d) {            
            if(e) {
                callback(null, {code:404})
                return;
            }   
            callback({success: true})            
        })        
    } else 
        callback(null, {code: 404})    
}