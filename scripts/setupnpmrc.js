var fs = require('fs');
var path = require('path');
var common = require('./common');

var userHome = process.env.USERPROFILE || process.env.HOME;

function saveNpmrc(npmrc) {
    var npmrcFile = path.join(userHome, '.npmrc');
    fs.writeFileSync(npmrcFile, npmrc);
    return npmrcFile;
}

function setupNpmrc(credentialId) {
    //var jenkinsUrl = 'https://jinbo:6d716e8c7fdf5607eb331562fc1d3d8d@docsci.cloudapp.net/scriptText';
    var jenkinsUrl = 'http://admin:test1@10.0.0.4:8080/scriptText';
    // var jenkinsUrl = common.getJenkinsUrl();
    var template = fs.readFileSync(path.join(__dirname, 'credential.groovy'));
    var scriptText = 'def credentialId="' + credentialId + '" \n ' + template;
    common.executeScript(jenkinsUrl, scriptText, function (error, data) {
        if (error) {
            console.log('Setup npmrc failed with error "' + error + '"');
            process.exit(1);
        } else if (!data || !data.trim()) {
            console.log('Cannot find the corresponding credential info via credentialId. Probably it doesn\'t exist.');
            process.exit(1);
        } else {
            var credential = JSON.parse(data);
            var npmrc =  new Buffer(credential.value, 'base64').toString("ascii");
            var npmrcFile = saveNpmrc(npmrc);
            console.log('save npmrc to ' + npmrcFile);
            process.exit(0);
        }
    });
};

if (process.argv.length < 3) {
    console.log('[Failed] Please specify credentialId parameter.');
    process.exit(1);
}

setupssh(process.argv[2]);
