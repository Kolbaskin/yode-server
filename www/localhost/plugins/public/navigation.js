exports.Plugin = function(server) {
    this.server = server;
}

exports.Plugin.prototype.global = function(req, callback, auth) {
    var me = this
    me.server.getModel('public.models.navigation').mainMenus(req, function(menus) {
        
        var fun1 = function() {
            me.server.getModel('public.models.navigation').seoText(req, function(text) {
                fun(text)
            }, auth)
        }            
        var fun = function(seoText) {
            var uname = (req.params? req.params.username:'')
                ,res = {seo: seoText, nav:menus, auth: (auth? {sess:auth, user: uname}:{sess:null,user:null})}
            
            me.server.getModel('public.models.navigation').childMenu(req, function(chmenu) {
                res.childMenu = chmenu
                me.server.getModel('public.models.navigation').crumbs(req, function(crumbs) {
                    res.crumbs = crumbs
                    callback(res)
                })
            }, auth)        
        }
        fun1();                            
    })
}

