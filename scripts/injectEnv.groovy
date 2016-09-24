
def currentBuild = Thread.currentThread().executable
def envVars = new hudson.EnvVars()
envs.each {
    envVars.put(it['key'], it['value'])
}
currentBuild.environments.add(hudson.model.Environment.create(envVars))