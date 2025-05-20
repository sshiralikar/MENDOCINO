if (!publicUser) {
    try {
        var messageList = "";

        // CAMEND-236 & CAMEND-526
        // if (AInfo["Primary Leach fields"] == "Yes") {
        //     var structureCounter = getASITRowCount("STRUCTURE/SITE PLAN ID LIST");
        //     logDebug("structureCounter: " + structureCounter);
        //     if (structureCounter < 1)
        //     {
        //         messageList += "Missing Table: " + "Structure/Site Plan ID" + br;
        //     }
        // }

        // CAMEND-231 & CAMEND-254 & CAMEND-218
        var inputCounter = getASITRowCount("INPUT(S)");
        logDebug("inputCounter: " + inputCounter);
        if (inputCounter < 1) {
            //messageList += "Missing Table: " + "Input(s)"  + br;
        }


        // CAMEND-233
        // if (AInfo["Clones cut/grown on-site"] == "Yes" || AInfo["Seeds produced/started on-site"] == "Yes") {
        //     var propagationCounter = getASITRowCount("PROPAGATION");
        //     logDebug("propagationCounter: " + propagationCounter);
        //     if (propagationCounter < 1)
        //     {
        //         messageList += "Missing Table: " + "Propagation"  + br;
        //     }
        // }

        // CAMEND-237 & CAMEND-526
        // if (AInfo["Employees on-site"] == "Yes") {
        //     var employeeCounter = getASITRowCount("EMPLOYEE LIST");
        //     logDebug("employeeCounter: " + employeeCounter);
        //     if (employeeCounter < 1)
        //     {
        //         messageList += "Missing Table: " + "Employee List"  + br;
        //     }
        // }

        // CAMEND - 830
        if (AInfo["SIUR"] == "Yes") {
            var watersource = getASITRowCount("WATER SOURCE");
            logDebug("structureCounter: " + watersource);
            if (watersource < 1) {
                messageList += "Please add a row with 'Water Source Type': 'Small Irrigation' in the following table: " + "Water Source" + br;
            }
            loadASITables();
            var flag = false;
            var watersource;
            if (typeof (WATERSOURCE) == "object") {
                watersource = WATERSOURCE.length;
                for (var i in WATERSOURCE) {
                    if (WATERSOURCE[i]["Water Source Type"] == "Small Irrigation") {
                        flag = true;
                        break;
                    }
                }
            }
            if (watersource > 0 && !flag) {
                messageList += "Please add a row with 'Water Source Type': 'Small Irrigation' in the following table: " + "Water Source" + br;
            }
        }

        // CAMEND-219
        if (AInfo["Water onsite"] == "Yes" || AInfo["Water source"] == "Yes") {
            var waterCounter = getASITRowCount("WATER SOURCE");
            logDebug("waterCounter: " + waterCounter);
            if (waterCounter < 1) {
                messageList += "Missing Table: " + "Water Source" + br;
            }
        }

        // CAMEND-164 & 253
        if (AInfo["Power source"] == "Yes") {
            var powerSource = getASITRowCount("POWER SOURCE(S)");
            logDebug("powerSource: " + powerSource);
            if (powerSource < 1) {
                messageList += "Missing Table: " + "Power Source(s)" + br;
            }
        }

        if (messageList != "") {
            cancel = true;
            showMessage = true;
            comment(messageList);
        }
    }
    catch (err) {
        logDebug(err);
    }
}
