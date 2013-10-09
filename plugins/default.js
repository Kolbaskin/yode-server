var fs = require('fs')
    ,dataFuncs = require('./admin/models/data')
    ,pages = require('pages')

/**
 * Инициализация плагина
 * 
 * 
 * 
**/
exports.Plugin = function(server) {
    this.server = server;
    this.db = this.server.inits.db
    
    this.tpls = {}
    this.controllers = {}
    this.readTemplates()
   //console.log('model.Plugin'); console.log(model)
    
    //if(!!model.Plugin) model = new(model.Plugin)(server)
}

/**
 * Прочитаем шаблоны
**/
exports.Plugin.prototype.readTemplates = function() {
    var me = this,
        plg, ctr;
    this.db.collection('admin_templates').find({removed:{$ne:true}}, {blocks:1, tpl:1, controller:1}).toArray(function(e,data) {
        if(data) {
            for(var i=0;i<data.length;i++) {
                me.tpls[data[i]._id] = data[i]
                
                if(data[i].controller && data[i].controller != '') {
                    
                    ctr = data[i].controller.split(":")
                    if(!ctr[1]) ctr[1] = 'run' // метод контроллера по-умолчанию
                    
                    me.tpls[data[i]._id].controller = null 
                    
                    if(me.server.getModel(ctr[0])) {                    
                        me.tpls[data[i]._id].controller = ctr[0];
                        me.tpls[data[i]._id].controllerMethod = ctr[1];                    
                    }
                    
                    
                } else me.tpls[data[i]._id].controller = null
            }
        } 
    })
}


/**
 * Шаг 1
 * Ищем нужную страницу в базе по имени каталога
 * если не находим, выходим наверх с результатом null
 * если находим, передаем дальше
**/
exports.Plugin.prototype.serve = function(request, callback, auth) {
    var me = this
        ,i = request.pathname.length-1

    while(i>=0 && request.pathname.charAt(i) != '/') i--;
    
    request.path = request.pathname.substr(0,i+1)
    request.page = request.pathname.substr(i+1)

    this.db.collection('pages').findOne({dir:request.path, removed:{$ne:true}}, function(e,data) {
        
       
        
        if(data) {
            // Проверим страницу на приватность
            // и наличие авторизации
            if(data.access && !auth) {
                callback(null, {code: 307, redirect: (me.server.config.REDIRECT_401 || '/')})
                return;
            }
            me.mainTpl(request, data, callback, auth );
        } else {
            callback(null)
        
        }
    })
    
    /*this.server.tpl('index', {}, function(code) {
        callback(code);
    })*/

}

/**
 * Шаг 2
 * Обработка основного шаблона 
 * с его основным контроллером
 * 
**/
exports.Plugin.prototype.mainTpl = function(request, data, callback, auth) {
    var me = this
    
    data.breaker = false
    
    request.pageData = data
  
    // если шаблона нет, смысл тоже теряется
    if(!data.tpl || !me.tpls[data.tpl]) {
        callback(null)
        return;
    }
   
    // Готовые данные кладем в шаблон
    var push2tpl = function(data) {
        if(data.blocks) delete data.blocks
        
        data.request = request
        
        me.server.tpl(me.tpls[data.tpl].tpl, data, function(code) {
            callback(code);
        })
    }
    
    // Готовим данные по блокам
    var getBlocks = function(data) {

        


        for(var i=1;i<=me.tpls[data.tpl].blocks;i++) {
            data['BLOCK_'+i] = []    
        }
 
        // пройдем по всем блокам и выполним код в них
        // каждый последующий блок выполняется строго после предыдущего
        var recur = function(j) {
            var b = data.blocks[j],
                plg, ctr;

            if(!b) {   
                push2tpl(data)
                return;
            }
      
      
            
            if(b.controller && b.controller != '') {
                
                ctr = b.controller.split(':')
                b.controller = ctr[0]
                if(!ctr[1]) ctr[1] = 'run' // метод контролера по-умолчанию

                if(!!(plg = me.server.getModel(ctr[0])) && !!plg[ctr[1]]) {

                    request.pageData = data
                    
                    if(ctr.length>2) {
                        if(!request.urlparams) request.urlparams = []
                        for(var ii=2;ii<ctr.length;ii++) request.urlparams.push(ctr[ii])
                    }
                    plg[ctr[1]](request, function(bdata, error) {
                        
                        if(error) {
                            callback(null, error)
                            return;
                        }
                        
                        if(!data['BLOCK_'+b.block]) data['BLOCK_'+b.block] = []
                        
                        if(bdata === Object(bdata)) {
                            if(bdata.html) data['BLOCK_'+b.block].push({html:bdata.html, m:true})
                            if(bdata.globals) {
                                for(var ii in bdata.globals) data[ii] = bdata.globals[ii]    
                            }
                        } else {
                            data['BLOCK_'+b.block].push({html:bdata, m:true})
                        }
                        recur(j+1)
                    }, auth, data)
                } else {
                    recur(j+1)
                }
            } else {
                if(b.text) {
                    data['BLOCK_'+b.block].push({html:b.text, m:false})
                }
                recur(j+1)
            }
            
        }
        recur(0)
    }
    
    var plg
    
    // Для начала подтянем шаблонный контроллер
    if(me.tpls[data.tpl].controller && (plg = me.server.getModel(me.tpls[data.tpl].controller)) && plg[me.tpls[data.tpl].controllerMethod]) {
        plg[me.tpls[data.tpl].controllerMethod](request, function(gdate) {
            for (var i in gdate) { data[i] = gdate[i]; }
            getBlocks(data)
        }, auth)
    } else getBlocks(data)
    
    //callback(data)
}

/**
 * html generation using an admin module model
 */
 
exports.Plugin.prototype.html = function(req, callback, auth) {    
    var me = this   

    req.urlparams[0] = '.modules.' + req.urlparams[0].replace('-', '.model.')    
    dataFuncs.getmodel(req, me, function(model) {        
        if(!model)  {
            callback('')
            return;
        }
        var publicConf = model.public(req)
        if(req.page && publicConf.tpl_row) {
        // let show one record    
            req.params.query = '[{"property":"_id", "value":"' + req.page + '"}]'
            dataFuncs.getdata(req.params, me, function(data) {            
                if(data && data.list && data.list[0]) {                    
                    if(publicConf.crumbField !== null) {
                        req.pageData.crumbs[req.pageData.crumbs.length-1].cur = null
                        if(data.list[0][publicConf.crumbField])
                            req.pageData.crumbs.push({name: data.list[0][publicConf.crumbField], cur: true})
                    }
                    
                    me.server.tpl(publicConf.tpl_row, data.list[0], function(code) {
                        callback(code);
                    })
                } else {
                    callback(null, {code: 404})
                }
            }, model)
        } else if(publicConf.tpl_list) { 
        // showing all records whith pages
        
            if(publicConf.sort) req.params.sort = publicConf.sort 
                        
            var limit = parseInt(req.params.limit)
            
            if(!limit || isNaN(limit) || limit>100) limit = 10;
                
            req.params.start = pages.getstart((req.params && req.params.page? parseInt(req.params.page):1), limit);
                    
            dataFuncs.getdata(req.params, me, function(data) {            
                data.pages = pages.create({start:req.params.start, limit: limit, total: data.total, req: req})
                if(data.pages.pageCount<=1) data.pages = null               
                me.server.tpl(publicConf.tpl_list, data, function(code) {                    
                    callback(code);
                })                
            }, model)
                        
        } else {
            callback(null);
        }
    }, auth, true)
}