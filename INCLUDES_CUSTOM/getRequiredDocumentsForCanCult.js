function getRequiredDocumentsForCanCult() {
    //showDebug = true;
    controlString = "";
    var nov = loadASITable("NOTICE OF VIOLATIONS");
    if (typeof (NOTICEOFVIOLATIONS) == "object")
        nov = NOTICEOFVIOLATIONS;
    var waterSource = loadASITable("WATER SOURCE");
    if (typeof (WATERSOURCE) == "object")
        waterSource = WATERSOURCE;
    var flag = false;
    if (arguments.length > 0) {
        appTypeString = arguments[1];
        flag = true;
    }
    var requirementArray = [];

    var isAppeal = appMatch("Cannabis/Amendment/Appeal/NA");
    var isAssignment = appMatch("Cannabis/Amendment/Assignment/NA");
    var isNOF = appMatch("Cannabis/Amendment/Notice of Fallowing/NA");
    var isNOFAffidavit = appMatch("Cannabis/Amendment/Notice of Fallowing/Affidavit");
    var isNOFRevocation = appMatch("Cannabis/Amendment/Notice of Fallowing/Revocation");
    var isTaxAppeal = appMatch("Cannabis/Amendment/Tax Appeal/NA");

    var ccblAffidavit = {
        condition: "CCBL Affidavit",
        document: "CCBL Affidavit"
    };

    var sitePlan = {
        condition: "Site Plan",
        document: "Site Plan"
    };

    var propertyOwnerConsent = {
        condition: "Property Owner Consent",
        document: "Property Owner Consent"
    }

    var annualTrueUpInvoice = {
        condition: "Annual True-Up Invoice",
        document: "Annual True-Up Invoice"
    }

    var cannabisProgramTaxImposed = {
        condition: "Cannabis Program Participants - Tax Imposed",
        document: "Cannabis Program Participants - Tax Imposed"
    }

    var commercialBusinessTaxForm = {
        condition: "Commercial Cannabis Cultivation Business Tax Registration Form",
        document: "Commercial Cannabis Cultivation Business Tax Registration Form"
    }

    var deathCertificate = {
        condition: "Death Certificate",
        document: "Death Certificate"
    }

    var decendentWillTestament = {
        condition: "Decedent's Last Will & Testament",
        document: "Decedent's Last Will & Testament"
    }

    var courtLettersTestamentary = {
        condition: "Court Provided Letters Testamentary",
        document: "Court Provided Letters Testamentary"
    }

    // CAMEND-703
    var suppDocs = {
        condition: "Supporting Documentation",
        document: "Supporting Documentation"
    };
    var suppDocs2 = {
        condition: "Supporting Documentation 2",
        document: "Supporting Documentation"
    };
    var suppDocs3 = {
        condition: "Supporting Documentation 3",
        document: "Supporting Documentation"
    };
    var suppDocs4 = {
        condition: "Supporting Documentation 4",
        document: "Supporting Documentation"
    };
    var suppDocs5 = {
        condition: "Supporting Documentation 5",
        document: "Supporting Documentation"
    };
    var suppDocs6 = {
        condition: "Supporting Documentation 6",
        document: "Supporting Documentation"
    };
    var suppDocs7 = {
        condition: "Supporting Documentation 7",
        document: "Supporting Documentation"
    };
    var suppDocs8 = {
        condition: "Supporting Documentation 8",
        document: "Supporting Documentation"
    };
    var suppDocs9 = {
        condition: "Supporting Documentation 9",
        document: "Supporting Documentation"
    };
    var suppDocs10 = {
        condition: "Supporting Documentation 10",
        document: "Supporting Documentation"
    };
    // CAMEND-703




    var wfStopPermanentOnly = [
        /*{
        task: "Initial Review",
        status: "Recommend Approval - Temporary"
    }, {
        task: "Initial Review",
        status: "Recommend Approval"
    }, {
        task: "Initial Review",
        status: "Recommend Approval - Interim"
    }, {
        task: "Initial Review",
        status: "Recommend Approval - Provisional"
    }, {
        task: "Supervisory Review",
        status: "Approved"
    }, {
        task: "Supervisory Review",
        status: "Interim Approved"
    }, {
        task: "Supervisory Review",
        status: "Provisional Approved"
    }, {
        task: "Supervisory Review",
        status: "Temporarily Approved"
    }*/
    ];



    // CAMEND-602 & CAMEND-711
    if (appMatch("Cannabis/*/Application/NA")) {
        requirementArray.push(ccblAffidavit);
        requirementArray.push(cannabisProgramTaxImposed);
        requirementArray.push(commercialBusinessTaxForm);
    }

    if (appMatch("Cannabis/*/Renewal/NA")) {
        // CAMEND-682
        // var DCCStateLicense = {
        //     condition: "Business Formation - DCC State License",
        //     document: "Business Formation - DCC State License",
        //     workflow: wfStopPermanentOnly
        // };
        // if (AInfo["State License Business"] == "Yes")
        //     requirementArray.push(DCCStateLicense);

        var doc5 = {
            condition: "Site Plan",
            document: "Site Plan",
            workflow: wfStopPermanentOnly
        };
        requirementArray.push(doc5);
        var doc2 = {
            condition: "Lake and Streambed Alteration Agreement",
            document: "Lake and Streambed Alteration Agreement",
            workflow: wfStopPermanentOnly
        };
        // CAMEND-766
        if (AInfo["LSAA"] == "Yes") {
            requirementArray.push(doc2);
        }
        var SWRCBNoticeType1 = {
            condition: "State Water Resource Control Board, Notice of Applicability",
            document: "State Water Resource Control Board, Notice of Applicability",
            workflow: wfStopPermanentOnly
        };
        if (AInfo["SWRCB Notice Type"] == "Notice of Applicability")
            requirementArray.push(SWRCBNoticeType1);
    }
    else if (isAssignment) {
        // CAMEND-600
        if (AInfo["Changes Made Since Last Site Plan"] == "Yes") {
            requirementArray.push(sitePlan);
        }
        // CAMEND-600
        if (AInfo["Owner of Property"] == "No") {
            requirementArray.push(propertyOwnerConsent);
        }
        // CAMEND-757
        if (AInfo["Deceased or Incapacitated Documents"] == "Death Certificate") {
            requirementArray.push(deathCertificate);
        }
        if (AInfo["Deceased or Incapacitated Documents"] == "Decedent's Last Will & Testament") {
            requirementArray.push(decendentWillTestament);
        }
        if (AInfo["Deceased or Incapacitated Documents"] == "Court Provided Letters Testamentary") {
            requirementArray.push(courtLettersTestamentary);
        }
        // CAMEND-757

        // CAMEND-804
        requirementArray.push(ccblAffidavit);
    }
    else if (isAppeal) {

    }
    else if (isNOF) {

    }
    else if (isNOFAffidavit) {

    }
    else if (isNOFRevocation) {

    }
    else if (isTaxAppeal) {
        // CAMEND-652
        if (AInfo["Received Tax Invoice"] == "Yes") {
            requirementArray.push(annualTrueUpInvoice);
        }
    }
    else {
        //CAMEND-153
        var businessInformation = {
            condition: "Business Formation",
            document: "Business Formation",
            workflow: wfStopPermanentOnly
        };
        var isAuthorized = (AInfo["Authorized"] == "Yes");
        if (isAuthorized)
            requirementArray.push(businessInformation);

        //CAMEND-154
        var POConsent = {
            condition: "Property Owner Consent",
            document: "Property Owner Consent",
            workflow: wfStopPermanentOnly
        };
        var isPropertyOwner = (AInfo["Owner of Property"] == "No");
        if (isPropertyOwner)
            requirementArray.push(POConsent);

        //CAMEND-160 & CAMEND-683
        // var WaterMonitoringReport = {
        //     condition: "Water Monitoring Report",
        //     document: "Water Monitoring Report",
        //     workflow: wfStopPermanentOnly
        // };
        // if (AInfo["Is NOA old"] == "Yes")
        //     requirementArray.push(WaterMonitoringReport);

        // //CAMEND-160 & CAMEND-526
        // var compliancePlan = {
        //     condition: "Compliance Plan",
        //     document: "Compliance Plan",
        //     workflow: wfStopPermanentOnly
        // };
        // if (AInfo["Unpermitted Existing Septic"] == "CHECKED")
        //     requirementArray.push(compliancePlan);

        //CAMEND-161
        var WaterSourceTable = {
            condition: "Water Source Table",
            document: "Water Source Table",
            workflow: wfStopPermanentOnly
        };
        //if (AInfo["Water source"] == "Yes" || AInfo["Water onsite"] == "Yes")
        //    requirementArray.push(WaterSourceTable);

        //CAMEND-298
        var WillServeLetterWater = {
            condition: "Will Serve Letter - Water Hauler Service Provider",
            document: "Will Serve Letter - Water Hauler Service Provider",
            workflow: wfStopPermanentOnly
        };
        var WillServeLetterCommunity = {
            condition: "Will Serve Letter - Community Provider",
            document: "Will Serve Letter - Community Provider",
            workflow: wfStopPermanentOnly
        };
        var WillServeLetterPortableToilet = {
            condition: "Will Serve Letter - Portable Toilets",
            document: "Will Serve Letter - Portable Toilets",
            workflow: wfStopPermanentOnly
        };
        var PondPermit = {
            condition: "Pond Permit",
            document: "Pond Permit",
            workflow: wfStopPermanentOnly
        };
        var Sensitive = {
            condition: "Sensitive Species Habitat Review, Bull Frog Management Plan",
            document: "Sensitive Species Habitat Review, Bull Frog Management Plan",
            workflow: wfStopPermanentOnly
        };
        var WellPermit = {
            condition: "Well Permit",
            document: "Well Permit",
            workflow: wfStopPermanentOnly
        };
        var WellLog = {
            condition: "Well Log",
            document: "Well Log",
            workflow: wfStopPermanentOnly
        };
        var SmallIrrigationUseRegistration = {
            condition: "Small Irrigation Use Registration",
            document: "Small Irrigation Use Registration",
            workflow: wfStopPermanentOnly
        };

        // CAMEND-526
        // if (AInfo["Portable Toilets"] == "CHECKED" && AInfo["Municipal sewer"] == "CHECKED")
        //     requirementArray.push(WillServeLetterPortableToilet);
        //CAMEND-221

        for (var x in waterSource) {
            if (waterSource[x]["Water Source Type"] == "Water Hauler Service Provider") {
                requirementArray.push(WillServeLetterWater);
            } if (waterSource[x]["Water Source Type"] == "Community Provider") {
                requirementArray.push(WillServeLetterCommunity);
            }
            if (waterSource[x]["Water Source Type"] == "Pond") {
                requirementArray.push(PondPermit);
                requirementArray.push(Sensitive);
            }
            if (waterSource[x]["Water Source Type"] == "Well") {
                requirementArray.push(WellPermit);
                requirementArray.push(WellLog);
            }
            if (waterSource[x]["Water Source Type"] == "Small Irrigation") {
                requirementArray.push(SmallIrrigationUseRegistration);
            }
        }
        var SensitiveSpeciesHabitatReview = {
            condition: "Sensitive Species Habitat Review, Generator / Machinery Noise Management Plan",
            document: "Sensitive Species Habitat Review, Generator / Machinery Noise Management Plan",
            workflow: wfStopPermanentOnly
        };
        var strTable = loadASITable("POWER SOURCE(S)");
        if (typeof (POWERSOURCES) == "object")
            strTable = POWERSOURCES;
        var gFlag = false;
        if (strTable && strTable.length > 0) {
            for (var i in strTable) {
                if (strTable[i]["Type of Power"] == "Generator")
                    gFlag = true;
            }
        }
        if (gFlag)
            requirementArray.push(SensitiveSpeciesHabitatReview);


        var SWRCBNoticeType1 = {
            condition: "State Water Resource Control Board, Notice of Applicability",
            document: "State Water Resource Control Board, Notice of Applicability",
            workflow: wfStopPermanentOnly
        };
        if (AInfo["SWRCB Notice Type"] == "Notice of Applicability")
            requirementArray.push(SWRCBNoticeType1);

        var SWRCBNoticeType2 = {
            condition: "State Water Resource Control Board, Notice of Exemption",
            document: "State Water Resource Control Board, Notice of Exemption",
            workflow: wfStopPermanentOnly
        };
        if (AInfo["SWRCB Notice Type"] == "Notice of Exemption")
            requirementArray.push(SWRCBNoticeType2);

        //CAMEND-290 & CAMEND-682
        // var DCCStateLicense = {
        //     condition: "Business Formation - DCC State License",
        //     document: "Business Formation - DCC State License",
        //     workflow: wfStopPermanentOnly
        // };
        // if (AInfo["State License Business"] == "Yes")
        //     requirementArray.push(DCCStateLicense);

        //CAMEND-289
        var SellersPermit = {
            condition: "Valid Seller's Permit",
            document: "Valid Seller's Permit",
            workflow: wfStopPermanentOnly
        };
        //if (AInfo["Seller's Permit"] == "Yes")
        //requirementArray.push(SellersPermit);

        //CAMEND-289 & CAMEND-682
        // var PropertyOwner = {
        //     condition: "Business Formation - Property Owner",
        //     document: "Business Formation - Property Owner",
        //     workflow: wfStopPermanentOnly
        // };
        // if (AInfo["Property Owner Business"] == "Yes")
        //     requirementArray.push(PropertyOwner);

        //CAMEND-294
        var IndoorQuestionnaire = {
            condition: "Indoor Questionnaire",
            document: "Indoor Questionnaire",
            workflow: wfStopPermanentOnly
        };
        if ((AInfo["Indoor SF"] != "" && AInfo["Indoor SF"]) &&
            (AInfo["Outdoor SF"] == "" || !AInfo["Outdoor SF"]) &&
            (AInfo["Mixed Light SF"] == "" || !AInfo["Mixed Light SF"]))
            requirementArray.push(IndoorQuestionnaire);

        //CAMEND-228
        var TimberlandPermit = {
            condition: "Timberland Permit",
            document: "Timberland Permit",
            workflow: wfStopPermanentOnly
        };
        if (AInfo["Timberland Permit"] == "Yes")
            requirementArray.push(TimberlandPermit);

        //CAMEND-227
        var swConstructionType401 = {
            condition: "SW 401",
            document: "SW 401",
            workflow: wfStopPermanentOnly
        };
        if (AInfo["SW 401"] == "CHECKED") {
            requirementArray.push(swConstructionType401);
        }
        var swConstructionType404 = {
            condition: "SW 404",
            document: "SW 404",
            workflow: wfStopPermanentOnly
        };
        if (AInfo["SW 404"] == "CHECKED") {
            requirementArray.push(swConstructionType404);
        }
        var artLight = {
            condition: "Sensitive Species Habitat Review, Artificial Light Management Plan",
            document: "Sensitive Species Habitat Review, Artificial Light Management Plan",
            workflow: wfStopPermanentOnly
        };
        if (AInfo["Artificial Light"] == "CHECKED") {
            requirementArray.push(artLight);
        }
        var LEEPEligibiltyLetter = {
            condition: "LEEP Eligibility Letter",
            document: "LEEP Eligibility Letter",
            workflow: wfStopPermanentOnly
        };
        var WaiverForm = {
            condition: "Waiver Form",
            document: "Waiver Form",
            workflow: wfStopPermanentOnly
        };
        if (AInfo["Equity Eligibility"] == "Yes") {
            requirementArray.push(WaiverForm);
            requirementArray.push(LEEPEligibiltyLetter);
        }
        var SIUR = {
            condition: "Small Irrigation Use Registration",
            document: "Small Irrigation Use Registration",
            workflow: wfStopPermanentOnly
        };
        if (AInfo["SIUR"] == "Yes") {
            requirementArray.push(SIUR);
        }
        var armyCorp = {
            condition: "Notice of Violation, Army Corp of Engineers",
            document: "Notice of Violation, Army Corp of Engineers",
            workflow: wfStopPermanentOnly
        };
        var dcc = {
            condition: "Notice of Violation, Department of Cannabis Control",
            document: "Notice of Violation, Department of Cannabis Control",
            workflow: wfStopPermanentOnly
        };
        var fishAndWildLife = {
            condition: "Notice of Violation, Department of Fish and Wildlife",
            document: "Notice of Violation, Department of Fish and Wildlife",
            workflow: wfStopPermanentOnly
        };
        var codeEnforcement = {
            condition: "Notice of Violation, Mendocino County Code Enforcement",
            document: "Notice of Violation, Mendocino County Code Enforcement",
            workflow: wfStopPermanentOnly
        };
        var stateWaterResource = {
            condition: "Notice of Violation, State Water Resource Control Board",
            document: "Notice of Violation, State Water Resource Control Board",
            workflow: wfStopPermanentOnly
        };

        for (var x in nov) {
            if (nov[x]["Issuing Agency"] == "Army Corp of Engineers") {
                requirementArray.push(armyCorp);
            }
            if (nov[x]["Issuing Agency"] == "Department of  Fish and Wildlife") {
                requirementArray.push(fishAndWildLife);
            }
            if (nov[x]["Issuing Agency"] == "Department of Cannabis Control") {
                requirementArray.push(dcc);
            }
            if (nov[x]["Issuing Agency"] == "Mendocino  County Code Enforcement") {
                requirementArray.push(codeEnforcement);
            }
            if (nov[x]["Issuing Agency"] == "State Water  Resource Control Board") {
                requirementArray.push(stateWaterResource)
            }
        }
        var doc1 = {
            condition: "EnviroStor / Cortese List",
            document: "EnviroStor / Cortese List",
            workflow: wfStopPermanentOnly
        };
        var doc2 = {
            condition: "Lake and Streambed Alteration Agreement",
            document: "Lake and Streambed Alteration Agreement",
            workflow: wfStopPermanentOnly
        };
        var doc3 = {
            condition: "Mendocino County Air Quality Management District Form",
            document: "Mendocino County Air Quality Management District Form",
            workflow: wfStopPermanentOnly
        };
        var doc4 = {
            condition: "Sensitive Species Habitat Review, Questionnaire",
            document: "Sensitive Species Habitat Review, Questionnaire",
            workflow: wfStopPermanentOnly
        };
        var doc5 = {
            condition: "Site Plan",
            document: "Site Plan",
            workflow: wfStopPermanentOnly
        };
        var doc6 = {
            condition: "Valid Seller's Permit",
            document: "Valid Seller's Permit",
            workflow: wfStopPermanentOnly
        };
        requirementArray.push(doc1);
        // CAMEND-766
        if (AInfo["LSAA"] == "Yes") {
            requirementArray.push(doc2);
        }
        requirementArray.push(doc3);
        requirementArray.push(doc4);
        requirementArray.push(doc5);
        requirementArray.push(doc6);


        var AgentConsentForm = {
            condition: "Agent Consent Form",
            document: "Agent Consent Form",
            workflow: wfStopPermanentOnly
        };
        // CAMEND-767
        var conArr = getContactObjs(capId, ["Authorized Agent"]);
        if (conArr.length > 0) {
            requirementArray.push(AgentConsentForm);
        }

        var SepticSystemPermit = {
            condition: "Septic System Permit",
            document: "Septic System Permit",
            workflow: wfStopPermanentOnly
        };
        var strTable = loadASITable("STRUCTURE/SITE PLAN ID LIST");
        if (typeof (STRUCTURESITEPLANIDLIST) == "object")
            strTable = STRUCTURESITEPLANIDLIST;
        var septicFlag = false;
        if (strTable && strTable.length > 0) {
            for (var i in strTable) {
                if (strTable[i]["Type of Structure"] == "Septic/Leach")
                    septicFlag = true;
            }
        }
        if (septicFlag)
            requirementArray.push(SepticSystemPermit);

        var waterAvailability = {
            condition: "Water Availability Analysis",
            document: "Water Availability Analysis",
            workflow: wfStopPermanentOnly
        };
        var wtrTable = loadASITable("WATER SOURCE");
        if (typeof (WATERSOURCE) == "object")
            wtrTable = WATERSOURCE;
        var waterAnalysisFlag = false;
        if (wtrTable && wtrTable.length > 0) {
            for (var i in wtrTable) {
                if (wtrTable[i]["Water Source Type"] != "Water Hauler Service Provider"
                    && wtrTable[i]["Water Source Type"] != "Community Provider")
                    waterAnalysisFlag = true;
            }
        }
        var zv = getZoningDistrictFromGISTable();
        if (zv && zv.toUpperCase() == "AG")
            waterAnalysisFlag = true;
        if (waterAnalysisFlag)
            requirementArray.push(waterAvailability);
    }
    return requirementArray;
}