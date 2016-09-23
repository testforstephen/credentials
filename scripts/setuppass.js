require('shelljs/global');

var exec = require('child_process').exec;
var request = require('request');
var fs = require('fs');
var path = require('path');
var common = require('./common');

var setuppass = function (credentialId) {
    var jenkinsUrl = 'https://jinbo:6d716e8c7fdf5607eb331562fc1d3d8d@docsci.cloudapp.net/scriptText';
    // var jenkinsUrl = common.getJenkinsUrl();
    var template = fs.readFileSync(path.join(__dirname, 'credential.groovy'));
    var scriptText = 'def credentialId="' + credentialId + '" \n ' + template;
    common.executeScript(jenkinsUrl, scriptText, function (error, data) {
        if (error) {
            console.log('Setup ssh key failed with error "' + error + '"');
            exit(1);
        } else if (!data || !data.trim()) {
            console.log('Cannot find the corresponding credential info via credentialId. Probably it doesn\'t exist.');
            exit(1);
        } else {
            console.log('Setup ssh key successfully.');
            console.log(data);
            exit(0);
        }
    });
};

if (process.argv.length < 3) {
    console.log('[Failed] Please specify credentialId parameter.');
    exit(1);
}

setupssh(process.argv[2]);
