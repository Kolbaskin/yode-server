/**
 * 
 * Virtual server config file
 * 
 */
exports.params = {
    
    /**
     * 
     * Main settings section
     * 
     */
    STATIC_DIR: 'static',
    ADMIN_MODULES_DIR: 'static/admin',
    UPLOAD_DIR: 'upload',              // dir for user files in STATIC_DIR
    ROWS_PER_PAGE: 20,
    
    /**
     * 
     * Logs and debuging section
     * 
     */
    LOGS: false,
    DEBUG: true,
    TIME_TO_CONSOLE_LOG: false,        
    
    /**
     * 
     * Server process section
     * 
     */
    /*
    PROCESS: {
        user: 'nobody',                // run server as user
        group: 'nobody'                // run server as group     
    },
    */
    
    /**
     * 
     * MongoDB section
     * 
     */
    MONGO: {
        db_name: '${MONGO.db_name}',
        port: ${MONGO.port},
        host: '${MONGO.host}',
        user: '${MONGO.user}',
        pass: '${MONGO.pass}'
    },
    
    MODULES_DIR: 'modules',
    
    /**
     * 
     * Memcached section
     * 
     */
    MEMCACHE: {
        host: '${MEMCACHE.host}',
        port: ${MEMCACHE.port}
    },
    
    /**
     * 
     * Session section
     * 
     */
    TOKEN: {
        lifetime: 300,                   // session max lifetime in sec
        len: 32,                         // token length bytes
        sessPassLen: 3                   // session password length
    },
    HASH_ALG: 'sha1',                    // Hash algorithm name
    
    /**
     * 
     * SendMail section
     * 
     */
    MAIL: {
        type: "SMTP",
        server:{
            /*host: "smtp.gmail.com",    // hostname
            secureConnection: true,      // use SSL
            port: 465,                   // port for secure SMTP
            auth: {
                user: "gmail.user@gmail.com",
                pass: "userpass"
            }*/
            service: "Gmail", /* Well known services: 
                                DynectEmail
                                Gmail
                                hot.ee
                                Hotmail
                                iCloud
                                mail.ee
                                Mail.Ru
                                Mailgun
                                Mandrill
                                Postmark
                                SendGrid
                                SES
                                Yahoo
                                yandex
                                Zoho */
            auth: {
                user: "",
                pass: ""
            }
        },
        
        from: '',
        loginAuthSubject: 'Session password',
        loginAuthBody: 'Session password: ${pass}'
        
    },
    
    GLOBAL_AUTH: true,                      // check authorisation globaly
    
    /**
     * 
     * Redirections section
     * 
     */
    /* 
    REWRITE_RULES: {
        "^(\/[a-z\.^\/^\/]{1,})\.([a-z^\/]{1,})\/":"$1:$2"
    },
    */
    //REDIRECT_401: '/',                      
    ERRORPAGES: {
        //404: '/errors/404/'    
    }
}
