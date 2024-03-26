function scriptTest(scriptText, commit) {
    try {
        var service = com.accela.aa.emse.dom.service.CachedService.getInstance().getEMSEService();

        var htResult = service.testScript(scriptText, aa.getServiceProviderCode(), aa.env.getParamValues(), 'ADMIN', commit);
        aa.env.setValue("SCRIPT_TEXT", "");
        aa.env.setValue("SCRIPT_RESULT", htResult.get("ScriptReturnDebug"));
        if (commit) {
            aa.env.setValue("ScriptReturnCode", "0");
        } else {
            aa.env.setValue("ScriptReturnCode", "-1");
        }

    } catch (e) {
        aa.env.setValue("ScriptReturnCode", "-2")
        aa.print(e)
        aa.env.setValue("SCRIPT_RESULT", e + "")
    }
}

function main(){

    var action = aa.env.getValue("action") + "";
    if (!action || action.length === 0) {
        aa.env.setValue("SCRIPT_RESULT", "Bad request, missing action");
        aa.env.setValue("ScriptReturnCode", "-2")
        return;
    }

    if(action === "test") {
        var testText = aa.env.getValue("text") + "";
        var commit = String("true").equals(aa.env.getValue("commit") + "");
        scriptTest(testText, commit);
    } else {
        aa.env.setValue("SCRIPT_RESULT", "Bad request, missing action");
        aa.env.setValue("ScriptReturnCode", "-2")
        return;
    }
}

main();