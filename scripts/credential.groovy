def getCredential(credentialId) {
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
        creds = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
        com.cloudbees.plugins.credentials.common.StandardUsernamePasswordCredentials.class,
        jenkins.model.Jenkins.instance
        )
        result = creds.findResult { it.id == credentialId ? it : null }
        if (result){
            return "{type:\"Userpass\", value:{username: \"${result.getUsername()}\", password: \"${result.getPassword()}\"}}"
        } else {
            return "";
        }
    }
}

println getCredential(credentialId)