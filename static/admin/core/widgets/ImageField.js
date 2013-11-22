Ext.define('MyDesktop.core.widgets.ImageField',{
    extend: 'Ext.form.FieldContainer'
    ,alias: 'widget.imagefield'

    ,layout: 'hbox'
    ,width: 500
    ,height:100
    
    ,tumbSizes: '220x130x460x330'
    
    ,imageDefaultValue: 'images/image_icon.png'
    
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
        
        var sz = me.tumbSizes.split('x')
        if(sz[0]) sz[0] = parseInt(sz[0])
        if(sz[1]) sz[1] = parseInt(sz[1])
        if(!sz[0] || isNaN(sz[0])) sz[0] = 150
        if(!sz[1] || isNaN(sz[1])) sz[1] = 150
        
        var rec = []
        
        var func = function() {
            rec.push({
    
                xtype: 'filefield',
                msgTarget: 'side',
                allowBlank: true,
                buttonOnly: true,
                width: sz[0],
                height: sz[1],
                fieldStyle: 'width:'+ sz[0] +'px;height:' + sz[1]+'px;',
                buttonConfig: {
                    tooltip: D.t('Select file'),
                    text: '',
                    width: sz[0],
                    height: sz[1]
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
                            if(v && v != '-') me.imageValue = v
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
                if(data.data && data.data.name) {
                    var    img_inp = me.down('[xtype=textfield]')
                    
                    me.noChange = true
                    
                    me.imageValue = '/tmp/'+data.data.name
                    me.showImage()
                    img_inp.setValue(data.data.name);

                }
            })                    
        }
    }
    
    ,removeImage: function() {
        this.down('[xtype=textfield]').setValue('-')
    }

})