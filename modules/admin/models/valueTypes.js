var forms = require('forms')

exports.getValue = function(data, name) {
    
    if(!data.value) return;

    if(data.type && this[data.type]) {
        return this[data.type](data, name)    
    }
    
    if(name == '_id') {
       var o_id;
       if((o_id = forms.strToId(data.value)) === 0) return; 
       
       return {_id: o_id}       
    }
    
    var v = data.value
        ,o = {};
 
    if(data.operator == 'lt' 
    || data.operator == 'gt'
    || data.operator == 'lte'
    || data.operator == 'gte'   
    ) {        
        o[name] = {}
        o[name]['$'+data.operator] = v
        return o;
    } else if(data.operator == 'eq') {
     
        o[name] = v
        return o;
    }
    return; 
}

exports.string = function(data, name) {
    var o = {}
        ,str =  data.value
                .replace(/\(/g, '\\(')
                .replace(/\)/g, '\\)')
     
    if(data.operator == 'like') {        
        try {            
<<<<<<< HEAD
            o[name] = new RegExp(str,'i')
=======
            o[name] = new RegExp( str,'i')
>>>>>>> 4b8d6ada867b5b1d419b729bb08fa6f202e46df5
        } catch(e) {return {}}
    }     
    return o
}

exports.date = function(data, name) {
    
    var o = {}, v = new Date(data.value);
    if(data.operator == 'eq') {
        o[name] = {        
            $gte: new Date(v.getFullYear(), v.getMonth(), v.getDate(), 0),
            $lte: new Date(v.getFullYear(), v.getMonth(), v.getDate(), 23, 59, 59)
        }
    } else
    if(data.operator == 'gte') {
        o[name] = {$gte: new Date(v.getFullYear(), v.getMonth(), v.getDate(), 0)}        
    }
    else
    if(data.operator == 'lte') {
        o[name] = {$lte: new Date(v.getFullYear(), v.getMonth(), v.getDate(), 23, 59, 59)}        
    }
    else
    if(data.operator == 'ne') {
        o.$or = [{},{}]        
        o.$or[0][name] = {$lte: new Date(v.getFullYear(), v.getMonth(), v.getDate(), 0)}
        o.$or[1][name] = {$gte: new Date(v.getFullYear(), v.getMonth(), v.getDate(), 23, 59, 59)}
        return o;
        
    }   
    
    
    return o
}