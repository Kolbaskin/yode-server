exports.port = 8000

exports.maxUploadSize = 2*1024*1024

exports.staticParams = {serverInfo: 'x-server', cache: 36000}

exports.formConfig = {
     encoding: 'utf-8'
     ,uploadDir: './tmp'
     ,maxFieldsSize: 1024*1024 // 1Mб
     //,maxFields:
}

exports.error_message = 'Houston, we have a problem!'

/*
exports.https = {
    port: 443,
    key: 'sert/key.pem',
    sert: 'sert/sert.pem'
}
*/