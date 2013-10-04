/**
 * 
 * News module for yode-server
 * 
 * backend model
 * ver 0.0.1
 * 
 * Copyright 2013
 * 
 */
 
exports.collection = 'news'

exports.fields = [
    {
        name: '_id',
        type: 'ObjectID',
        visable: true
    },{
        name: 'title',
        type: 'string',
        filterable: true, // if the property "filterable" is true, there will be an index on the field in mongodb
        editable: true,   // This field can be edited
        visable: true     // This field can be showed to users
    },{
        name: 'datepubl',
        type: 'date',
        sort: -1,
        filterable: true,
        editable: true,
        visable: true
    },{
        name: 'dateunpubl',
        type: 'date',
        filterable: true,
        editable: true,
        visable: true
    },{
        name: 'shorttext',
        type: 'string',
        editable: true,
        visable: true
    },{
        name: 'ontop',
        type: 'boolean',
        filterable: true,
        editable: true,
        visable: true
    },{
        name: 'descript',
        type: 'string',
        filterable: true,
        editable: true,
        visable: true
    },{
        name: 'photos',
        type: 'images',
        filterable: false,
        editable: true,
        visable: true
    }        
]


exports.public = function(req) {    
    var d = new Date()
        ,cnf = {
            find: {
                datepubl:{$gte: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0)},
                dateunpubl: {$lte: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)}
            }
            ,sort: {ontop:-1, datepubl:-1}
        }
    
    if(req.pageData.dir == '/') {
        req.params.limit = 6 // only 6 latest news on main 
        cnf.tpl_list = 'mdl/news_list_on_main.tpl' // self template for main page
    } else {
        req.params.limit = 15 // paging step
        cnf.tpl_row = 'mdl/news_row.tpl'   
        cnf.tpl_list = 'mdl/news_list.tpl'
        cnf.crumbField = '' // you can put here a name of a folder for the page crumbs        
    }    
    return cnf;
}