/**
 * $Id: editor_plugin.js 
 *
 * @author Max Tushev
 * @copyright Copyright � 2004-2009, Max Tushev, All rights reserved.
 */

(function() {
	var DOM = tinymce.DOM;

	tinymce.create('tinymce.plugins.InsertObjectPlugin', {
		init : function(ed, url) {
			// Register commands
			ed.addCommand('mceInsertObject', function() {
				    
                    //var st = prompt('test','test')
                    
                    var fm = Ext.create('MyDesktop.modules.filemanager.controller.fm')
                    fm.openfile(function(files) {console.log(files)}) 
                    
      				
					//ed.execCommand('mceInsertContent', 0, st);

			});

			// Register buttons
			ed.addButton('insertobject', {
                title : 'insertobject.desc', 
                cmd : 'mceInsertObject', 
                image : url + '/img/example.gif'
            });

		},

		getInfo : function() {
			return {
				longname : 'Insertobject',
				author : 'Maxim Tushev',
				authorurl : 'http://www.wpier.ru',
				infourl : 'http://www.wpier.ru',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('insertobject', tinymce.plugins.InsertObjectPlugin);
})();
