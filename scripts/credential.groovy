def getCredential(credentialId) {
    /* Try SSH credential */
    def creds = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
        com.cloudbees.jenkins.plugins.sshcredentials.SSHUserPrivateKey.class,
        jenkins.model.Jenkins.instance
    )

    def result = creds.findResult { it.id == credentialId ? it : null }

    if (result) {
        def privateKey = result.getPrivateKeys()[0];
        def encodeKey = privateKey.bytes.encodeBase64().toString()
      return "{\"type\":\"SSH\", \"value\":{\"username\": \"${result.getUsername()}\", \"privateKey\": \"${encodeKey}\", \"passphrase\": \"${result.getPassphrase()}\", \"description\": \"${result.getDescription()}\" }}"
    } else {
        /* Try UsernamePassword credential */
        creds = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
                com.cloudbees.plugins.credentials.common.StandardUsernamePasswordCredentials.class,
                jenkins.model.Jenkins.instance
            )
        result = creds.findResult { it.id == credentialId ? it : null }
        if (result){
            return "{type:\"Userpass\", value:{username: \"${result.getUsername()}\", password: \"${result.getPassword()}\"}}"
        } else {
            /* Try Secret credential */
            creds = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
                    org.jenkinsci.plugins.plaincredentials.StringCredentials.class,
                    jenkins.model.Jenkins.instance
                )
            result = creds.findResult { it.id == credentialId ? it : null }
            if (result) {
                def encodeSecret = result.getSecret().toString().bytes.encodeBase64().toString()
                return "{\"type\":\"Secret\", \"value\":\"${encodeSecret}\"}"
            }
        }
    }
    return "";
}

println getCredential(credentialId)