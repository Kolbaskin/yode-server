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
                    
                    var sizeStr = function(sz) {
                        if(sz < 1024) return sz
                        sz = Math.round(sz*10/1024)/10
                        if(sz < 1024) return sz + 'K'
                        sz = Math.round(sz*10/1024)/10
                        return sz + 'M'
                    }
                    
                    var fm = Ext.create('MyDesktop.modules.filemanager.controller.fm')
                    fm.openfile(function(files) {
                        
                        var j, e, s = [], df = []
                        for(var i=0;i<files.length;i++) {
                            j = files[i].filename.length-1
                            while(j>0 && files[i].filename.charAt(j) != '.') j--;
                            e = files[i].filename.substr(j+1).toLowerCase();
  
                            if(e == 'gif' || e == 'png' || e == 'jpg' || e == 'jpeg') {
                                s.push('<img src="'+files[i].id+'" />')    
                            } else {
                                df.push(files[i])
                            }
                        }
                        
                        s = s.join(' ')
                        if(df && df.length>0) {
                            if(df.length == 1) {
                                s += '<a href="'+df[0].id+'">'+df[0].filename+'</a> ('+sizeStr(df[0].size)+')';
                            } else {
                                for(var i=0;i<df.length;i++) {
                                    df[i] = '<tr>'
                                    + '<td><a href="'+df[i].id+'">'+df[i].filename+'</a></td>'
                                    + '<td>'+df[i].type+'</td>'
                                    + '<td>'+sizeStr(df[i].size)+'</td>'
                                    + '</tr>'
                                }
                                s += '<table class="files-list"><tr>'
                                    +'<th>'+D.t('File name')+'</th>'
                                    +'<th>'+D.t('File type')+'</th>'
                                    +'<th>'+D.t('File size')+'</th>'
                                    +'</tr>'
                                    +df.join('\n')
                                    +'</table>'
                            }
                        }
                        
                        ed.execCommand('mceInsertContent', 0, s);
                    }) 
			});

			// Register buttons
			ed.addButton('insertobject', {
                title : D.t('Insert images and other files'), 
                cmd : 'mceInsertObject', 
                image : url + '/insert_element.png'
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
