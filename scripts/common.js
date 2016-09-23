var request = require('request');

module.exports.executeScript = function (jenkinsUrl, scriptText, callback) {
    request.post({
        url : jenkinsUrl,
        form : {
            script : scriptText
        }},
        function (error, response, body) {
            if (error) {
                callback(error);
            } else if (response && response.statusCode === 200) {
                callback(null, body);
            } else {
                callback('HTTP status code - ' + response.statusCode);
            }
        });
};

module.exports.getJenkinsUrl = function () {
    if (process.env['JENKINS_URL']) {
        var jenkinsUrl = process.env['JENKINS_URL'];
        jenkinsUrl = jenkinsUrl(/http:\/\//, 'http://admin:test1@');
        jenkinsUrl = jenkinsUrl(/https:\/\//, 'https://admin:test1@');
        return jenkinsUrl;
    } else if (process.env['SSH_CONNECTION']) {
        var segments = process.env['SSH_CONNECTION'].split(' ');
        return 'http://admin:test1@' + segments[0] + ':8080/scriptText';
    } else {
        return 'http://admin:test1@localhost:8080/scriptText';
    }
};