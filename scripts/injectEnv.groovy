
def build = Thread.currentThread().executable
envs.each {
    def pa = new hudson.model.ParametersAction([
        new hudson.model.StringParameterValue(it['key'], it['value'])
    ])
    build.addAction(pa)
}

