{
    "Cannabis/Entity/Prequalification/Application": {
      "WorkflowTaskUpdateAfter": [
        {
          "preScript": "",
          "metadata": {
            "description": "entity issuance",
            "operators": {}
          },
          "criteria": {
            "task": [
              "Application Issuance"
            ],
            "status": [
              "Approved"
            ]
          },
          "action": {
            "customFieldGroup": "",
            "customFieldRecordGrouping": "",
            "customListName": "MJ_LICENSURE TYPE",
            "customListGroupField": "License Category",
            "customListValueField": "License Type",
            "customFieldRecordTypeMapping": {
              "Adult-Use": {
                "Cannabis Cultivation": "Cannabis/Adult-Use/Cultivation/Application",
                "Cannabis Dispensary": "Cannabis/Adult-Use/Dispensary/Application",
                "Cannabis Processor": "Cannabis/Adult-Use/Processor/Application",
                "Cannabis Product Manufacturer": "Cannabis/Adult-Use/Manufacturer/Application",
                "Cannabis Optional Premises Cultivation": "Cannabis/Adult-Use/Optional Prem Culti/Application",
                "Cannabis Transport": "Cannabis/Adult-Use/Transport/Application",
                "Cannabis Delivery-Only": "Cannabis/Adult-Use/Delivery-Only/Application"
              },
              "Medicinal Use": {
                "Cannabis Medical Center": "Cannabis/Medical/Medical Center/Application",
                "Cannabis Cultivation": "Cannabis/Medical/Cultivation/Application",
                "Cannabis Dispensary": "Cannabis/Medical/Dispensary/Application",
                "Cannabis Optional Premises Cultivation": "Cannabis/Medical/Optional Prem Culti/Application",
                "Cannabis Processor": "Cannabis/Medical/Processor/Application",
                "Cannabis Product Manufacturer": "Cannabis/Medical/Manufacturer/Application",
                "Cannabis Transport": "Cannabis/Medical/Transport/Application",
                "Cannabis Delivery-Only": "Cannabis/Medical/Delivery-Only/Application"
              },
              "Combo": {
                "Cannabis Cultivation": "Cannabis/Combo/Cultivation/Application",
                "Cannabis Dispensary": "Cannabis/Combo/Dispensary/Application",
                "Cannabis Microbusiness": "Cannabis/Combo/Microbusiness/Application",
                "Cannabis Optional Premises Cultivation": "Cannabis/Combo/Optional Prem Culti/Application",
                "Cannabis Processor": "Cannabis/Combo/Processor/Application",
                "Cannabis Product Manufacturer": "Cannabis/Combo/Manufacturer/Application",
                "Cannabis Testing Facility": "Cannabis/Combo/Testing Facility/Application",
                "Cannabis Transport": "Cannabis/Combo/Transport/Application",
                "Cannabis Delivery-Only": "Cannabis/Combo/Delivery-Only/Application"
              }
            },
            "childTempRecord": true,
            "childRecordStatus": "Pending",
            "CFGroupsToCopy": "APPLICANT INFORMATION,PREMISES INFORMATION,PERMITS",
            "copyCF": true,
            "copyCT": false,
            "recordIdField": ""
          },
          "postScript": ""
        }
      ]
    }
  }