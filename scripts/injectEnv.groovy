
def currentBuild = Thread.currentThread().executable
def envVars = [];
envs.each {
    envVars.push(new hudson.model.StringParameterValue(it['key'], it['value']))
}
currentBuild.addAction(new hudson.model.ParametersAction(envVars))
