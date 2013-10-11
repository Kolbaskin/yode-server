Core = {}

Modules = {
    requires: [
        "Ext.window.MessageBox", 
        "Ext.ux.desktop.ShortcutModel", 
        "MyDesktop.Settings"
    ], 
    shortcuts: [],//{ name: 'Grid Window', iconCls: 'grid-shortcut', module: 'grid-win' }],
    quickStart: []//{ name: 'Grid Window', iconCls: 'grid-shortcut', module: 'grid-win' }] // ---//----
}

Modules.defaultCoun = Modules.requires.length

/*Ext.Loader.setPath({
    'Ext.ux.desktop': 'js',
    MyDesktop: ''
})
*/
Ext.Loader.setConfig({
    enabled: true,
    paths: {
		'Ext.ux.aceeditor': '/ext/src/ux/aceeditor',
        'Ext.ux.desktop': 'js',
        MyDesktop: ''
	}
});
    
Ext.require([ 'Ext.ux.aceeditor.Panel', 'MyDesktop.core.Ajax' ]);

var myDesktopApp,
    initLoad = true;
    
Ext.onReady(function () {
    
    Ext.override(Ext.selection.Model, {
        storeHasSelected: function (record) {
            var store = this.store,
                records,
                len, id, i;
            if (record.hasId() && store.getById(record)) {
                return true;
            }

            if (store.data instanceof Ext.util.LruCache) {
                var result = false;
                store.data.forEach(function (rec) {
                    return !(result = (record.internalId === rec.internalId));
                });
                return result;
            }

            records = store.data.items;
            len = records.length;
            id = record.internalId;
            for (i = 0; i < len; ++i) {
                if (id === records[i].internalId) {
                    return true;
                }
            }
            return false;
        }
    });
    
    
    Ext.QuickTips.init();
    Ext.tip.Tip.prototype.minWidth = 'auto';
    Ext.form.Field.prototype.msgTarget = 'side';
    
    Core.Ajax.request({
        url: 'model:usermoduleslist',                                
        succ: function(data){
    
            for(var i=0;i<data.length;i++) {
                Modules.requires.push('MyDesktop.modules.'+data[i].controller)
            }    
            Ext.require('MyDesktop.App', function() {
                //setTimeout(function() {
                    Core.Ajax.request({
                        url: 'model:getuserinfo',
                        succ: function(data){
                            Sess.userName = data.login
                            Sess.states = data.sets
                            Sess.superuser = !!data.superuser
                            if(!Sess.superuser && data.group && data.group.modelAccess) 
                                Sess.modelAccess = data.group.modelAccess
                            else
                                Sess.modelAccess = {}
                            
                            setTimeout(function() {
                                myDesktopApp = new MyDesktop.App();                                
                                var dset = Sess.getState('desktop')
                                if(dset) setTimeout(function() {
                                    myDesktopApp.desktop.setWallpaper(dset.wallPaper, dset.stretch);
                                    if(dset.shortcuts) {
                                        myDesktopApp.desktop.shortcutsView.getStore().add(dset.shortcuts)
                                    }
                                    if(dset.quickStart) {
                                        var w = 0, fn = function(b) {
                                            b.getEl().on('contextmenu', function(e) {
                                                myDesktopApp.desktop.taskbar.onQuickStartContextMenu(e, b)
                                            });
                                        }
                                        for(var i=0;i<dset.quickStart.length;i++) {
                                            w +=  32;
                                            dset.quickStart[i].handler = function() {
                                                myDesktopApp.desktop.taskbar.onQuickStartClick(this)
                                            }
                                            fn(myDesktopApp.desktop.taskbar.quickStart.add(dset.quickStart[i]))                                            
                                        }
                                        myDesktopApp.desktop.taskbar.quickStart.setWidth(w);
                                        
                                    }
                                },500)
                            }, 1000)
                        }
                    }) 
                    
                    
                //}, 500)
            })
                            
        }, callback: function(a1, a2, a3) {
            if(a3.status == 401) {
                location = '/admin.controller:login/';    
            }
        }
    })    
});

Sess = {            
    url: function(url) {            
        var id = localStorage.getItem('uid') || 0
            ,token = localStorage.getItem('token') || 0;
        
        if(url.charAt(0) == '/') return url+'/?id='+id+'&token='+token;
        
        return '/admin.'+url+'/?id='+id+'&token='+token;
    },
    userName: '',
    userIconCls: 'user',
    loaded: {},
    makeGuid: function() {
        var s4 = function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                     .toString(16)
                     .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    },
    states: {},
    getState: function(winId) {
        if(Sess.states && Sess.states[winId]) return  Sess.states[winId]
        return null
    },
    
    setState: function(winId, sets) {
        if(!Sess.states) Sess.states = {}
        if(!Sess.states[winId]) Sess.states[winId] = {}
        for(var i in sets) {
            Sess.states[winId][i] = sets[i]
        }
        
        Core.Ajax.request({
            url: 'model:setusersets',
            jsonData: Sess.states
        })
        
    }
}

TEXTS={}
        
D={
    t:function(t,val) {
        var tx;
        if(LOCALE && LOCALE[t]) tx = LOCALE[t]
        else 
        if(TEXTS && TEXTS[t]) tx = TEXTS[t]
        else tx = t
	    if(val!=null)
		for(var i=0;i<val.length;i++) tx=tx.replace('%s',val[i]);
	    return tx;
	},
    a:function(title,text, vals, susses) {
        Ext.Msg.alert(D.t(title), D.t(text,vals), function(btn){
		    if(susses!=null) susses();
	    });
	},
	c:function(title,text, vals, susses) {
	    Ext.Msg.confirm(D.t(title), D.t(text,vals), function(btn){
                if (btn == 'yes'){
		    susses();
		}
	    });
	},
	w:function(t,v) {
	    alert(D.t(t,v));
	},
	p:function(t,t1,v,susses) {
	    Ext.MessageBox.prompt(D.t(t), D.t(t1), function(btn, text){
		if (btn == 'ok'){
		    susses(text);
		}
	    },null,null,v);	    
	},
    translit: function(s) {
        var lets = {
            '1072':'a',
            '1073':'b',
            '1074':'v',
            '1075':'g',
            '1076':'d',
            '1077':'e',
            '1105':'е',
            '1078':'j',
            '1079':'z',
            '1080':'i',
            '1081':'i',
            '1082':'k',
            '1083':'l',
            '1084':'m',
            '1085':'n',
            '1086':'o',
            '1087':'p',
            '1088':'r',
            '1089':'c',
            '1090':'t',
            '1091':'u',
            '1092':'f',
            '1093':'h',
            '1094':'tc',
            '1095':'ch',
            '1096':'sh',
            '1097':'sth',
            '1098':'',
            '1099':'i',
            '1100':'',
            '1101':'e',
            '1102':'yu',
            '1103':'ya'
        }
        ,os = ''
        ,c
        ,cc;
        s = s.toLowerCase()
        for(var i=0;i<s.length;i++) {
            c = s.charAt(i)
            cc = s.charCodeAt(i)+''
        
            if(lets[cc]) os += lets[cc]
            else if(/[0-9\w\-]/.test(c)) os += c
            else if(c == ' ') os += '_'
        }
        return os;
    },
    
    translate: function(s, callback) {
        Ext.Ajax.request({
            url: ['https://translate.yandex.net/api/v1.5/tr.json/translate?',
                  'key=trnsl.1.1.20130506T105223Z.fb8448be3498cdae.cc08a93c29a57ba3ea1a7a641e9af39821d017ae&',
                  'lang=ru-en&',
                  'text='+s].join(''),                                
            success: function(data){
                data = Ext.decode(data.responseText);   
                if(data && data.code && data.code==200) {
                    callback(D.translit(data.text[0]))
                } else
                    callback(D.translit(s))
            }
        })            
    }
}