
$(document).ready(function() {

    var l = localStorage.getItem('locale');
    if(l) {
        l = $('[value=' + l + ']')
        if(l) l.attr('selected', true)
    }

    var success = function(data) {
    
        localStorage.setItem('uid', data.id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('locale', $("[name=lan]").val());
        location = "/admin/"
    }

    var step2 = function(data) {
         
         var p = $("#sesspass").val();
         
         if(p!=null && p!='') {
            $.post("/admin.model:enter2step/", {
                token: data.token,
                id: data.id,
                pass: p
            }, function(r) {
                if(r.data != null) {
                    success(r.data);    
                } else {
                    alert('Session password error!');    
                }
            }, 'JSON');
        }  
    }

    $("#submit").click(function() {
        var l = $("#login").val(),
            p = $("#pass").val();
            
        if(l!='' && p!='') {    
            $.post("/admin.model:login/", {
                login: l,
                pass: p
            }, function(r) {
                if(r.status && r.status == 'OK' && r.data) {
                    if(r.data && r.data.dblauth) {
                        $("#step1").css("display","none")
                        $("#step2").css("display","block")
                        $("#submit2").click(function() {
                            step2(r.data);    
                        });                         
                    } else {
                        success(r.data);
                    }
                } else {
                    $("#login").val('');
                    $("#pass").val('');
                    $("#error").css('display', '');
                }
            }, 'json'); 
        }
        return false;
    });
    
});