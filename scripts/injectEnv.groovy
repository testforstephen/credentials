
def jenkinsInstance = jenkins.model.Jenkins.getInstance()
def item = jenkins.model.Jenkins.getInstance().getItemByFullName("testJob")
def currentBuild = item.getBuildByNumber(buildNumber)
def parameters = []
envs.each{
    parameters.push(new hudson.model.StringParameterValue(it['key'], it['value']))
}
currentBuild.addAction(new hudson.model.ParametersAction(parameters))
currentBuild.getEnvironment()
