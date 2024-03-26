{
  "Cannabis/Medical/*/*": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "Sends Additional Info Required Email Template with available parameters",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [],
          "status": [
            "Additional Info Required"
          ]
        },
        "action": {
          "notificationTemplate": "SS_ADDITIONAL_INFO_REQD",
          "notificationReport": [],
          "notifyContactTypes": [
            "Authorized Agent",
            "Business Entity"
          ]
        },
        "postScript": ""
      }
    ],
    "InspectionScheduleAfter": [
      {
        "metadata": {
          "description": "Send notification when inspection is scheduled",
          "operators": {}
        },
        "preScript": "",
        "criteria": {},
        "action": {
          "notificationTemplate": "SS_INSPECTION_SCHEDULED",
          "notificationReport": "",
          "notifyContactTypes": [
            "Authorized Agent",
            "Business Entity"
          ],
          "additionalEmailsTo": "",
          "url4ACA": "",
          "createFromParent": false,
          "reportingInfoStandards": ""
        },
        "postScript": ""
      }
    ],
    "InsepctionResultSubmitAfter": [
      {
        "metadata": {
          "description": "Send notification when an inspection is resulted",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "inspectionTypePerformed": [],
          "inspectionResult": []
        },
        "action": {
          "notificationTemplate": "SS_INSPECTION_RESULT",
          "notificationReport": "",
          "notifyContactTypes": [
            "Authorized Agent",
            "Business Entity"
          ],
          "additionalEmailsTo": "",
          "url4ACA": "",
          "createFromParent": false,
          "reportingInfoStandards": ""
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Medical/*/Application": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "Sends Denied Email Template to necessary Contact Types with available parameters",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [],
          "status": [
            "Denied"
          ]
        },
        "action": {
          "notificationTemplate": "SS_APP_DENIED",
          "notificationReport": [],
          "notifyContactTypes": [
            "Authorized Agent",
            "Business Entity"
          ]
        },
        "postScript": ""
      },
      {
        "metadata": {
          "description": "Sends Withdrawn Email Template to necessary Contact Types with available parameters",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [],
          "status": [
            "Withdrawn"
          ]
        },
        "action": {
          "notificationTemplate": "SS_APP_WITHDRAWAL",
          "notificationReport": [],
          "notifyContactTypes": [
            "Authorized Agent",
            "Business Entity"
          ]
        },
        "postScript": ""
      },
      {
        "metadata": {
          "description": "Sends License Issued Email Template with attached Agency License Report to necessary Contact Types with available parameters",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [
            "License Issuance"
          ],
          "status": [
            "Issued"
          ]
        },
        "action": {
          "notificationTemplate": "SS_LICENSE_ISSUED_REPORT",
          "notificationReport": [
            "Cannabis License Form"
          ],
          "reportParamContactType": "Business Entity",
          "createFromParent": true,
          "notifyContactTypes": [
            "Authorized Agent",
            "Business Entity"
          ]
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Medical/*/License": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "Specific contacts should be notified when License Status is updated.",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [
            "License Status"
          ],
          "status": []
        },
        "action": {
          "notificationTemplate": "SS_LICENSE_STATUS",
          "notificationReport": [],
          "notifyContactTypes": [
            "Authorized Agent",
            "Business Entity"
          ]
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Medical/*/Renewal": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "Sends License Issued Email Template with attached Agency License Report to necessary Contact Types with available parameters",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [
            "Renewal"
          ],
          "status": [
            "Renewed"
          ]
        },
        "action": {
          "notificationTemplate": "SS_LICENSE_ISSUED_REPORT",
          "notificationReport": [
            "Agency License Report"
          ],
          "reportParamContactType": "Business Entity",
          "notifyContactTypes": [
            "Business Entity"
          ],
          "additionalEmailsTo": "",
          "url4ACA": "",
          "createFromParent": true,
          "reportingInfoStandards": ""
        },
        "postScript": ""
      }
    ]
  }
}