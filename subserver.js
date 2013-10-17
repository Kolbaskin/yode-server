var  static   = require('node-static')
    ,urlutils = require('url')
    ,fs       = require('fs')
    ,jqtpl = require('jqtpl')
    ,http_codes = require('http_codes')
    ,gc = require('gc')
    ,util = require('util')


/**
 *
 * Инициализация суб-сервера на своем каталоге
 * 
**/
exports.Server = function(projDir, statServParam, host, port) {
    this.dir = projDir
    this.host = host
    this.port = port
    this.plugins = {}
    this.models = {}
    this.config = {}
    this.serverDir = __dirname
    
    this.started = false
    //this.tpls = {}
    
    if(fs.existsSync(projDir+'/config.js')) {
        var cnf = require(projDir+'/config');
        this.config = cnf.params;
    }    
    
    var staticDir = projDir+'/'+(this.config.STATIC_DIR == null? 'static':this.config.STATIC_DIR)
    this.static = new(static.Server)(staticDir, statServParam); 
    
    // Раз в минуту запускаем сборщика мусора
    setInterval(function() {
        gc.run(staticDir + '/tmp', 600)
    }, 60000);
    
    
}

/**
 * добавляем новую модель
 *
 */
 
exports.Server.prototype.getModel = function(name) {
    
    if(this.models[name]) {
        return this.models[name]
    } else {
        
        var plg
            ,path = name.replace(/\./g,'/');
        
        if(fs.existsSync(this.dir+'/'+this.config.PLUGIN_DIR+'/'+path+'.js')) {
            plg = require(this.dir+'/'+this.config.PLUGIN_DIR+'/'+path);
        } else
        if(fs.existsSync(__dirname + '/plugins/'+path+'.js')) {
            plg = require('./plugins/'+path);
        }
        
        if(plg) {
            this.models[name] = new(plg.Plugin)(this);
            return this.models[name]
        }
    }
    return;

}

/**
 * Вывод данных в шаблон
 *
**/
var tplIncludes = function(dir, htm, callback) {
    htm = htm.replace(/\{\{include[\s]{1,}[\'\"]([\w\.\/]{1,})[\'\"]\}\}/gi, function(p1,path) {
        if(fs.existsSync(dir + path)) {
            return fs.readFileSync(dir + path, 'utf8');
        }
        return "";
    })    
    callback(htm)
}

var getLocaleText = function(text, lng, srv) {
    if(srv.config.LOCALE[lng]) {
        if(!srv.LOCALE) srv.LOCALE = {}
        if(!srv.LOCALE[lng]) {
            srv.LOCALE[lng] = require(srv.dir + '/' + srv.config.LOCALE[lng]);
        }
        if(srv.LOCALE[lng].replaces[text]) return srv.LOCALE[lng].replaces[text]            
    }
    return text
}

exports.Server.prototype.tpl = function(tplname, data, callback, lng) {     
    var th = this;   
    
    if(th.config.LOCALE && lng) {
        data.L = function(text) {
            return getLocaleText(text, lng, th)
        }
    }
    if(jqtpl.cache[tplname] == null) {
        fs.exists(th.dir+'/view/'+tplname, function(log) {
            if(log) fs.readFile(th.dir+'/view/'+tplname, 'utf8', function (err, htm) {
                if (err) console.log(err);
                else {
                    
                    tplIncludes(th.dir+'/view/', htm, function(htm) { // добавим инклуды
                        if(th.config.DEBUG == null || !th.config.DEBUG) {
                            jqtpl.compile(htm, tplname);
                            callback(jqtpl.render(tplname, data))
                        } else {
                            callback(jqtpl.render(htm, data))
                        }
                    })
                }
            });  
        });
    } else {
        callback(jqtpl.render(tplname, data))
    }
}


/**
 * Подключим контроллер по умолчанию
 * он будет обрабатывать все урлы
 * на выходе null если подходящая страница не найдена
 * или готовый html
**/
exports.Server.prototype.getDefaultController = function() {
    var plg
    
    if(fs.existsSync(this.dir+'/'+this.config.PLUGIN_DIR+'/default.js')) {
        plg = require(this.dir+'/'+this.config.PLUGIN_DIR+'/default');
    } else
    if(fs.existsSync(__dirname + '/'+this.config.PLUGIN_DIR+'/default.js')) {
        plg = require('./'+this.config.PLUGIN_DIR+'/default');
    }
    
    if(plg) this.defaultPlugin = new(plg.Plugin)(this);
    
        
}

/**
 * Инициализация проекта
 * подключение к СУБД, memcached и т.п.
 * зависит от проекта
**/
exports.Server.prototype.init = function(callback) { 
    var th = this    
    
    if(fs.existsSync(this.dir+'/init.js')) {
        var init = require(this.dir+'/init');
        init.start(function(inits) {
            th.inits = inits;
            th.getDefaultController()
            callback();
            th.started = true
        }, th)
    
    } else {
        th.getDefaultController()
        callback();
        th.started = true
    }
}
 
/**
 * Основной серверный метод
 * req -- http-запрос
 * res -- http-ответ
 * post -- POST-данные (если есть)
**/
exports.Server.prototype.serve = function(req, res, post, nohead) {
    var th = this 
        
    if(th.config.TIME_TO_CONSOLE_LOG) {
        var Time_Log = new Date().getTime();    
    }
    
    if(!th.started) {
        res.writeHead(503, 'Service Unavailable', {'Content-Type': 'text/plain'});
        res.end('Server is temporarily unavailable.\nPlease try later!');
        return;
    }
    
    var mcallback = function(body, error, head) {            
        if(!body && error) {
            th.error(error, res)
            return;        
        }            
        if(typeof body === "object" && (!head || (head.heads && ['text/plain','text/json'].indexOf(head.heads['Content-Type']) != -1))) {
            if(!head) head = 'JSON'
            body = JSON.stringify({status: 'OK', data: body})
        }        
        if((head == null || head == 200) && !nohead) res.writeHead(200, "OK", {'Content-Type': 'text/html; charset=utf-8'});
        else if(head == "JSON") {
            res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
            if(body == null && error != null) {
                body = JSON.stringify({status: 'FAULT', data: error})
            }
        } else if(!nohead) res.writeHead(head.code, head.status, head.heads);
        if(th.config.TIME_TO_CONSOLE_LOG) {
            Time_Log = new Date().getTime() - Time_Log; 
            console.log(req.url + ': ' +Time_Log+ ' ms');
        }            
        res.end(body); 
    }    

    var x = req.url.split("/")
    if(x[1].indexOf(':') != -1) {
        th.servePlugins(req, res, post, mcallback)
    } else {
        //this.serveVirtualPages(req, res, post, mcallback)
        this.serveVirtualPages(req, res, post, function(result, e) {
            // если виртуальная страница не найдена
            // поищем подходящие плагины
            if(!result && !e) {   
                mcallback(null, {code: 404})
            } else {
                mcallback(result, e)
            }
        })
    } 
}

/**
 * Обработка ошибок
 **/
exports.Server.prototype.error = function(error, res) {

    var me = this 
        ,text = 'nternal Server Error'
        ,headers = {'Content-Type': 'text/html; charset=urf-8'}
    
    if(error.redirect) headers = {'Location': error.redirect}

    if(error.code && http_codes.httpCodes[error.code]) {
        text = http_codes.httpCodes[error.code]
    } else error.code = 500
    
    res.writeHead(error.code, text, headers);
    
    if(this.config.ERRORPAGES && this.config.ERRORPAGES[error.code]) {
        // Если в конфиге указана страница для этой ошибки, подгрузим такую страницу
        me.serve({url: this.config.ERRORPAGES[error.code], headers:{cookie:''}}, res, null, true)
    } else res.end();    
}

/**
 * Пробуем получить виртуальную страницу
 * через "контроллер по-умолчанию"
 * 
**/
exports.Server.prototype.serveVirtualPages = function(req, res, post, callback) {       
    if(!this.defaultPlugin) {
        callback()
    } else {
        var me = this,
            url = urlutils.parse(req.url, true)
        
        if(me.config.LOCALE && !url.locale) {
            url.locale = req.url.substr(1,2)
        }
        
        url.params = {}
        req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            url.params[parts[0].trim()] = decodeURIComponent((parts[1] || '').trim());
        });
        if(url.query != null) for(var i in url.query) url.params[i] = url.query[i]
        if(post != null) for(var i in post) url.params[i] = post[i]       
        
        var run = function(a) {            
            me.defaultPlugin.serve(url, function(result, e) {
                callback(result,e)
            },a)
        }
        
        if(me.inits.checkauth != null) {  // if isser user checkauth function                
            me.inits.checkauth(url.params, function(a) {
                run(a)
            })                    
        } else {
            run(null);
        }
        
    }
    
}

/**
 * Запуск плагинов
 * происходит только в случае, если не найдена виртуальная страница
 * 
 * принцип поиска плагинов по адресной строке:
 * 
 * вариант 1
 * ищем файл в каталоге /<1й_параметр_после_домена>/controller.js
 * если находим, второй параметр -- вызываемый методе
 * 
 * если не находим файл или метод в нем,
 * 
 * ищем файл
 * /<1й_параметр_после_домена>/<2й_параметр>.js
 * 3й пареметр - вызываемый метод
 * 
 * если файл или метод не найдены,
 * ищем в статике или возвращаем ошибку
 * 
**/
exports.Server.prototype.servePlugins = function(req, res, post, mcallback) {     
    var url = urlutils.parse(req.url, true),
        u = url.pathname.split("/"),    
        par = [],
        plg = null;         


    
    if(u[1] && u[1] != '') {
        u[1] = u[1].split(":");       
        if(!u[1][1]) {
            mcallback(null, {code:404})
            return;
        }
        
        var me = this
            ,plugin = u[1][0]
            ,method = u[1][1]
            ,module = this.getModel(plugin)
    
        // Try to run model method
        var runModelPlugin = function(module, method) {
        
            var all = {urlparams:[]}
            
            
            
            for(var i=2;i<u.length;i++) all.urlparams.push(decodeURIComponent(u[i]));            
               
            req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
                var parts = cookie.split('=');
                all[parts[0].trim()] = decodeURIComponent((parts[1] || '').trim());
            });   
            if(url.query != null) for(var i in url.query) all[i] = url.query[i]
            if(post != null) for(var i in post) all[i] = post[i]
            
            all._query = url.query
            
            if(me.config.LOCALE && !all.locale) {
                all.locale = req.url.substr(1,2)
            }
            
            var run = function(auth) { 
                all.href = req.url  
                
                //console.log(req.url)
                
                module[method](all, mcallback, auth);
            }            
      
            if(me.inits.checkauth != null) {  // if isser user checkauth function                
                me.inits.checkauth(all, function(a) {run(a)})                    
            } else {
                run(null);
            }
            return true;
        }        
        if(module && !!module[method]) {
            runModelPlugin(module, method)
            return;
        }         
        
        // End Try to run model method        
    } 
    this.error(req, res, 404);
}

// Serve static files
exports.Server.prototype.statserve = function(req, res, callback) {    
    this.static.serve(req, res, callback)    
}

// Error pages
/*exports.Server.prototype.error = function(req, res, err) {    
    res.writeHead(500, "Internal Server Error", {'Content-Type': 'text/plain;charset=urf-8'});
    res.end('Internal Server Error');  
}
*/
