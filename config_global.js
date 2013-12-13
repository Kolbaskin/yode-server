exports.params = {
    port             : ${port},
    projects_dir     : "${projects_dir}",
    tmp_dir          : "${tmp_dir}", 
    logs_file        : "${logs_file}",
    gc_timeout       : 300000,

    numWorkers       : ${numWorkers},
    
    main_process_name: "yode-server",
    
    checkerTimeout   : 1000,
    
    maxUploadSize    : 20000000, // in bytes

    // memory limit for the process in Mb
    memLimit         : 400,

    staticParams     : {serverInfo: "x-server", cache: 36000},

    formConfig: {
         encoding: "utf-8"
        ,uploadDir: "./tmp"
        ,maxFieldsSize: 1024*1024 // 1Mб
        //,maxFields:
    },
    
    // List of plugins
    plugins: [
        //"yode-rewrite"
    ]

    /*
    "https": {
        "port": 443,
        "key": 'sert/key.pem',
        "sert": 'sert/sert.pem'
    }
    */
}