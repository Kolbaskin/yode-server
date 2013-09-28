/**
 * $Id: editor_plugin.js 
 *
 * @author Max Tushev
 * @copyright Copyright � 2013, Max Tushev, All rights reserved.
 */

(function() {
    var DOM = tinymce.DOM;

	tinymce.create('tinymce.plugins.CodeEditorPlugin', {
		init : function(ed, url) {
			

            // Register commands
			ed.addCommand('mceEditCode', function() {

                

                var save = function() {
                    var v = w.down('AceEditor').getValue()
                    document.getElementById(ed.editorId).value = v
                    ed.setContent(v)
                }
                
                var w = new Ext.window.Window({
                    width: 800,
                    height: 500,
                    layout: 'border',
                    title: 'editor',
                    bodyStyle: 'padding:0;',
                    items: [{
                        region: 'center',
            			xtype: 'AceEditor',
                        margin:0,
            			//theme: 'ambiance',
            			printMargin: false,
            			useWrapMode: true,
                        fontSize: '13px',
            			sourceCode: ed.contentDocument.body.innerHTML,
            			parser: 'html'
            		}],
                    buttons: [
                        {
                            text: D.t('Update'),
                            handler: function() {
                                save();   
                                w.close();
                            }
                        },{
                            text: D.t('Accept'),
                            handler: function() {
                                save();   
                            }
                        },
                        {
                            text: D.t('Cancel'),
                            handler: function() {w.close();}
                        }
                    ]
                }).show();                        
                
                
                Ext.getCmp(ed.editorId.replace('-inputEl','')).up('window').on('close', function() {
                    alert(111)
                    w.close();    
                })
                
                    /*fm.openfile(function(files) {
                        
                        
                        
                        ed.execCommand('mceInsertContent', 0, s);
                    })*/ 
			});
            
        

			// Register buttons
			ed.addButton('codeedit', {
                title : D.t('Edit page html'), 
                cmd : 'mceEditCode', 
                image : url + '/page_code.png'
            });
            
		},

		getInfo : function() {
			return {
				longname : 'Codeeditor',
				author : 'Maxim Tushev',
				authorurl : 'http://www.makeshow.ru',
				infourl : 'http://www.makeshow.ru',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('codeeditor', tinymce.plugins.CodeEditorPlugin);
})();
