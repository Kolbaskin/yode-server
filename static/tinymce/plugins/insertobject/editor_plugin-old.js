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
			var t = this;
			
			ed.prevObj=new parent.PrevObj();
			t.editor = ed;
			
			ed.getdoctype=function(fn) {
				var i=fn.length;
				var ex='';
				while(--i>=0 && fn.charAt(i)!='.') {
					ex=fn.charAt(i)+ex;
				}
				ex=ex.toLowerCase();
				if(ex=='jpg' || ex=='gif' || ex=='jpeg' || ex=='png') return "";
				var ph='';
				var nm='';
				while(--i>=0 && fn.charAt(i)!='/') {
					nm=fn.charAt(i)+nm;
				}
				while(--i>=0 && fn.charAt(i)!='=') {
					ph=fn.charAt(i)+ph;
				}
				ph='/files.images'+ph.substring(1)+'/'+nm+'.'+ex;
				return [nm+'.'+ex,ex,ph];
			}
			
			ed.escape_fn=function(fn) {
			  var x=fn.indexOf('getimage=');
			  if(x>0) {
			    fn=fn.substr(0,x)+'esc=yes&getimage='+escape(fn.substr(x+9));
			  }
			  return fn;
			} 
			
			// Register commands
			ed.addCommand('mceInsertObject', function() {
				var win, de = DOM.doc.documentElement;
				parent.IO.OpenFileDlg(parent.DLG.t('Insert objects'),[['*.gif,*.jpg,*.jpeg,*.png','Images (gif, jpeg, png)'],['*.doc,*.xls,*.pdf,*.zip,*.rar','Documents (doc, xls, pdf, zip, rar)'],['*.*','All formats (*.*)']],function(fn){
					fn=ed.prevObj.ShowPics(fn);
					var i1,i2,ex,st='';
      					for(var i=0;i<fn.length;i++) {
      						ex=ed.getdoctype(fn[i]);
      						if(ex=='') {
      							    							
      							i1=ed.escape_fn(fn[i]).replace("../","/");
      							i2=i1;      					
      							st+='<p class="img_right"><a href="'+i2+'" class="lightbox" rel="gallery"><img src="'+i1+'" border="0" alt="" /></a><span>подпись к картинке</span></p>';
      							
      						} else st+='<a href="'+ex[2]+'" class="down f'+ex[1]+'">'+ex[0]+'</a><br>';
      					}
					ed.execCommand('mceInsertContent', 0, st);
				});

				//

			});

			// Register buttons
			ed.addButton('insertobject', {title : 'insertobject.desc', cmd : 'mceInsertObject'});

			/*ed.onNodeChange.add(function(ed, cm) {
				cm.setActive('fullscreen', ed.getParam('fullscreen_is_enabled'));
			});*/
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
