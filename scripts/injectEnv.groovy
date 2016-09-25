
class VariableInjectionAction implements hudson.model.EnvironmentContributingAction {
    private String key
    private String value

    public VariableInjectionAction(String key, String value) {
        this.key = key
        this.value = value
    }

    public void buildEnvVars(hudson.model.AbstractBuild build, hudson.EnvVars envVars) {

        if (envVars != null && key != null && value != null) {
            envVars.put(key, value);
        }
    }

    public String getDisplayName() {
        return "VariableInjectionAction";
    }

    public String getIconFileName() {
        return null;
    }

    public String getUrlName() {
        return null;
    }
}

def item = jenkins.model.Jenkins.getInstance().getItemByFullName(jobName)
println item
def currentBuild = item.getBuildByNumber(buildNumber)
envs.each {
    currentBuild.addAction(new VariableInjectionAction(it['key'], it['value']))
    currentBuild.getEnvironment()
}
