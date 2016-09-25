var exec = require('child_process').exec;
var request = require('request');
var fs = require('fs');
var path = require('path');
var common = require('./common');

var userHome = process.env.USERPROFILE || process.env.HOME;

function getUnixSsh() {
    return '/usr/bin/ssh';
}

function generateSshDir() {
    var dir = path.join('/tmp', 'ssh' + new Date().getTime());
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
}

function createSshkeyFile(tempdir, privateKey) {
    var sshkeyFile = path.join(tempdir, 'id_rsa_1');
    fs.writeFileSync(sshkeyFile, privateKey, 'utf8');
    // chmod 400 
    fs.chmodSync(path.resolve(sshkeyFile), 0400);
    return sshkeyFile;
}

function createUnixGitSSH(tempdir, sshkeyFile) {
    var gitSshFile = path.join(tempdir, 'ssh.sh');
    var result = "";
    result += ("#!/bin/sh\n");
    // ${SSH_ASKPASS} might be ignored if ${DISPLAY} is not set
    result += ("if [ -z \"${DISPLAY}\" ]; then\n");
    result += ("  DISPLAY=123.456;\n");
    result += ("  export DISPLAY;\n");
    result += ("fi\n");
    result += ("/usr/bin/ssh -i \"" + path.resolve(sshkeyFile) + "\" -o StrictHostKeyChecking=no \"$@\"");
    fs.writeFileSync(gitSshFile, result);
    // chmod +x
    fs.chmodSync(path.resolve(gitSshFile), 0500);
    return gitSshFile;
}

function createUnixSshAskpass(tempdir, passphrase) {
    var gitPassFile = path.join(tempdir, 'pass.sh');
    var result = "";
    result += ('#!/bin/sh\n');
    result += ('echo "' + passphrase + '"');
    fs.writeFileSync(gitPassFile, result);
    // chmod +x
    fs.chmodSync(path.resolve(gitPassFile), 0500);
    return gitPassFile;
}

function createEnvVarFile(gitSshFile, gitPassFile) {
    var tmpfile = path.join('/tmp', 'envVar.sh');
    var result = "export GIT_SSH=" + gitSshFile + "\n";
    result += "export SSH_ASKPASS=" + gitPassFile + "\n";
    if (!process.env['DISPLAY']) {
        result += "export DISPLAY=123.456";
    }
    fs.writeFileSync(tmpfile, result);
    fs.chmodSync(path.resolve(tmpfile), 0500);
    return tmpfile;
}

function setupssh(credentialId) {
    //var jenkinsUrl = 'https://jinbo:6d716e8c7fdf5607eb331562fc1d3d8d@docsci.cloudapp.net/scriptText';
    var jenkinsUrl = 'http://admin:test1@sitexpci-internal.southeastasia.cloudapp.azure.com:8080/scriptText';
    // var jenkinsUrl = common.getJenkinsUrl();
    var template = fs.readFileSync(path.join(__dirname, 'credential.groovy'));
    var scriptText = 'def credentialId="' + credentialId + '" \n ' + template;
    common.executeScript(jenkinsUrl, scriptText, function (error, data) {
        if (error) {
            console.log('Setup ssh key failed with error "' + error + '"');
            process.exit(1);
        } else if (!data || !data.trim()) {
            console.log('Cannot find the corresponding credential info via credentialId. Probably it doesn\'t exist.');
            process.exit(1);
        } else {
            // console.log('Setup ssh key successfully.');
            var credential = JSON.parse(data);
            var privateKey =  new Buffer(credential.value.privateKey, 'base64').toString("ascii");
            var sshkeyFolder = generateSshDir();
            var sshkeyFile = createSshkeyFile(sshkeyFolder, privateKey);
            var gitSshFile = createUnixGitSSH(sshkeyFolder, sshkeyFile);
            var gitPassFile = createUnixSshAskpass(sshkeyFolder, credential.value.passphrase);
            var envVarFile = createEnvVarFile(gitSshFile, gitPassFile);
            console.log(envVarFile);
            process.exit(0);
            // var injectEnvTemplate = fs.readFileSync(path.join(__dirname, 'injectEnv.groovy'));
            // var injectEnvScript = "def envs=["
            //     + "[key: 'GIT_SSH', value: '" + gitSshFile + "']," 
            //     + "[key: 'SSH_ASKPASS', value: '" + gitSshFile + "']";
            // if (!process.env['DISPLAY']) {
            //     injectEnvScript += ",[key: 'DISPLAY', value:'123.456']";
            // }
            // injectEnvScript += "] \n";
            // injectEnvScript += "def jobName='" + process.env.JOB_NAME + "'\n";
            // injectEnvScript += "def buildNumber='" + process.env.BUILD_NUMBER + "'\n";
            // injectEnvScript += injectEnvTemplate;
            // console.log(injectEnvScript);
            // common.executeScript(jenkinsUrl, injectEnvScript, function (error, data) {
            //     if (error) {
            //         console.log('Setup ssh environment variables failed with error "' + error + '"');
            //         exit(1);
            //     } else {
            //         console.log(data);
            //         console.log('Inject succeed.');
            //         exit(0);
            //     }
            // });
        }
    });
};

console.log(process.argv);
if (process.argv.length < 3) {
    console.log('[Failed] Please specify credentialId parameter.');
    process.exit(1);
}

setupssh(process.argv[2]);
