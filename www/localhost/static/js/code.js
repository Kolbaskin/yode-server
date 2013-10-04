$(document).ready(function() {
    $(".thickbox").thickbox()    
})

// for paging
$(window).load(
    function() {
        $(document.body).keydown(function(ev) {
            if(!ev) ev = window.event;
            if(ev.ctrlKey) {
                if(ev.keyCode==39) {
                // go next
                    var h = $("#nextLink")
                    if(h[0] && h[0].href) {
                        location = h[0].href
                        return false;
                    }
                }
                if(ev.keyCode==37) {
                // go prev 
                    var h = $("#prevLink")
                    if(h[0] && h[0].href) {
                        location = h[0].href
                        return false;
                    }
                }                
            }
        })
	}
);