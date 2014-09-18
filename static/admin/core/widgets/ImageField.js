Ext.define('MyDesktop.core.widgets.ImageField',{
    extend: 'Ext.form.FieldContainer'
    ,alias: 'widget.imagefield'

    //,layout: 'hbox'

    ,tumbSizes: '220x130x460x330'
    
    ,imageDefaultValue: 'images/image_icon.png'
    ,width: 200
    ,buttonAlign: 'left'

    ,initComponent: function() {     
        if(this.buttonAlign == 'top' || this.buttonAlign == 'bottom') {
            this.layout = 'vbox'    
        }
        this.items = this.buildItems()

        this.imageValue = this.imageDefaultValue
        this.createContextMenu()
        
        
        this.callParent();
    }
    
    ,createContextMenu: function() {
        var me = this
        me.contextMenu = Ext.create('Ext.menu.Menu', {
            items: [{
                text: D.t('Remove image'),
                iconCls: 'remove',
                handler: function() {me.removeImage()}
            }]
        });
    }
    
    ,setWidth: function(w) {
        var me = this
            ,btn = me.down('[xtype=filefield]').button
        if(btn) {
            var bt = btn.getEl()            
            bt.setStyle('width', w+'px')
        }
        this.callParent(arguments);
    }
    
    ,setHeight: function(w) {
        var me = this
            ,btn = me.down('[xtype=filefield]').button
        if(btn) {
            var bt = btn.getEl()            
            bt.setStyle('height', w+'px')
        }
        this.callParent(arguments);
    }
    
    ,showImage: function() {
        var me = this
            ,btn = me.down('[xtype=filefield]').button
            ,bsz
        
        if(btn) {
            var bt = btn.getEl()
            bt.setStyle('background','url(' + me.imageValue + ') center center no-repeat')  
            
            if(me.imageValue == me.imageDefaultValue) {
                bsz = 'auto'
                bt.on('contextmenu', function(e) {
                     e.preventDefault();
                })
            } else {
                bsz = 'contain'
                bt.on('contextmenu', function(e) {
                     e.preventDefault();
                     me.contextMenu.show(bt);
                })
            }
            
            bt.setStyle('background-size',bsz)
            bt.setStyle('-webkit-background-size',bsz)
            bt.setStyle('-o-background-size',bsz)
            bt.setStyle('-moz-background-size',bsz)

        }    
    }
    
    ,buildItems: function() {
        var me = this
        
        
        if(!me.width || !me.height) {
            var sz = me.tumbSizes.split('x')
            if(sz[0]) sz[0] = parseInt(sz[0])
            if(sz[1]) sz[1] = parseInt(sz[1])
            if(!sz[0] || isNaN(sz[0])) sz[0] = 150
            if(!sz[1] || isNaN(sz[1])) sz[1] = 150
            
            if(!me.width) me.width = sz[0]
            if(!me.height) me.height = sz[1]
        }
        
        var rec = []
        
        
        var func = function() {
            
            rec.push({
    
                xtype: 'filefield',
                msgTarget: 'side',
                allowBlank: true,
                buttonOnly: true,
                width: me.width,
                height: me.height,
                fieldStyle: 'width:'+ me.width +'px;height:' + me.height+'px;',
                buttonConfig: {
                    tooltip: D.t('Select file'),
                    text: '',
                    width: me.width,
                    height: me.height
                },
                listeners: {
                    change: function(el) {
                        me.upload(el)
                    }    
                }
            },{
                xtype: 'textfield',
                inputType: 'hidden',
                name: me.name,
                listeners: {
                    boxready: function() {
                        me.showImage()    
                    },
                    change: function(e,v) {
                        if(!me.noChange ) {
                            if(v && v != '-') me.imageValue = v + 'nocached'
                            else me.imageValue = me.imageDefaultValue
                            me.showImage()
                        }
                        me.noChange = false;
                    }
                }
            })   
        }
        
        func()
        
        return rec
    }
    
    ,upload: function(inp) {        
        var me = this       
        if(inp.fileInputEl.dom.files.length>0) {
            Core.Ajax.upload(inp.fileInputEl.dom.files[0], '/admin.models.fileOperations:upload/' + me.tumbSizes + '/', function(data) {
                if(data.response && data.response.name) {
                    var    img_inp = me.down('[xtype=textfield]')
                    
                    me.noChange = true
                    
                    me.imageValue = '/tmp/'+data.response.name
                    me.showImage()
                    img_inp.setValue(data.response.name);
                    inp.fileInputEl.dom.value = ''
                }
            })                    
        }
    }
    
    
    
    ,removeImage: function() {
        this.down('[xtype=textfield]').setValue('-')
    }

})