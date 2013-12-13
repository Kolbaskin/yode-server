var data = require('../admin/models/data')
    ,forms = require('forms')
    ,pages = require('pages')

exports.Plugin = function(server) {
    this.server = server
    this.db = this.server.inits.db
    this.search = this.server.inits.search
}

exports.Plugin.prototype.query = function(req, callback, auth) {
    
    var me = this
  
    if(!req.q && req.params.q) req.q = req.params.q

    if(me.search && req.q) {
        
        
        var limit = parseInt(req.params.limit)
        if(!limit || isNaN(limit) || limit>100) limit = 25;
        req.params.start = pages.getstart((req.params && req.params.page? parseInt(req.params.page):1), limit);
                
        me.search.SetLimits(req.params.start, limit)
        me.search.Query(req.q, me.server.config.SEARCH_ENGINE.index, function(err, result) { 
            if(err) {
                callback(null, {code: 500})
                return;
            }            
            result.query = req.q
            
            result.pages = pages.create({start:req.params.start, limit: limit, total: result.total_found, req: req})
            
            me.server.tpl('mdl/search_results.tpl', result, function(code) {
                callback(code);
            }, req.locale)
        });
        
    } else {
        callback(null, {code: 500})
    }
    
}

exports.Plugin.prototype.gotopage = function(req, callback, auth) {
    var me = this
    data.getmodel(req, me, function(model) {
        var o_id
        if(model && (o_id = forms.strToId(req.urlparams[1]))) {
            
            if(!model.searchBuildDocUrl) {
                callback(null, {code: 404})
                return;
            }
            
            me.db.collection(model.collection).findOne({_id: o_id}, function(e, data) {
                
                if(!data) {
                    callback(null, {code: 404})
                    return;
                }
                
                model.searchBuildDocUrl(data, function(url) {
                    if(url) {
                        callback(null, null, {code: 301, status: 'Moved Permanently', heads: {'Location': url}})
                    } else callback(null, {code: 404})
                })
                
                
            })
        }
    }, auth, true)
}