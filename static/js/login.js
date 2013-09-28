
$(document).ready(function() {

    var success = function(data) {
    
        localStorage.setItem('uid', data.id);
        localStorage.setItem('token', data.token);
        
        location = "/admin/"
        
        //location = "/admin/main/?token="+data.token+"&id="+data.id
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
                if(r.status && r.status == 'OK') {
                    if(r.data.dblauth != null && r.data.dblauth) {
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