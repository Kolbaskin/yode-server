//123
exports.params = {
    STATIC_DIR: 'static',
    ADMIN_MODULES_DIR: 'static/admin',
    ROWS_PER_PAGE: 20,
    UPLOAD_DIR: 'upload', // dir for user files in STATIC_DIR
    LOGS: true,
    MONGO: {
        db_name: '${MONGO.db_name}',
        port: ${MONGO.port},
        host: '${MONGO.host}',
        user: '${MONGO.user}',
        pass: '${MONGO.pass}'
    },
    DEBUG: true,
    TIME_TO_CONSOLE_LOG: false, // замеры времени
    PLUGIN_DIR: 'plugins',
    MEMCACHE: {
        host: '${MEMCACHE.host}',
        port: ${MEMCACHE.port}
    },
    TOKEN: {
        lifetime: 300, // session max lifetime in sec
        len: 32, // token length bytes
        sessPassLen: 3 // session password length
    },
    MAIL: {
        type: "SMTP",
        server:{
            /*host: "smtp.gmail.com", // hostname
            secureConnection: true, // use SSL
            port: 465, // port for secure SMTP
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
    HASH_ALG: 'sha1',
    GLOBAL_AUTH: true, // check authorisation globaly
    REDIRECT_401: '/',
    ERRORPAGES: {
        //404: '/errors/404/'    
    }
}
