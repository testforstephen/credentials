
def item = hudson.model.Hudson.instance.getItemByFullName(jobName)
def currentBuild = item.getBuildByNumber(buildNumber)
def envVars = new hudson.EnvVars()
envs.each {
    envVars.put(it['key'], it['value'])
    println it['key'] + ':' + it['value']
}
currentBuild.getEnvironments().add(hudson.model.Environment.create(envVars))