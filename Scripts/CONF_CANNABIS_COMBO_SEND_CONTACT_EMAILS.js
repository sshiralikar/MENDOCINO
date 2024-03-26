{
  "Cannabis/Combo/*/*": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "Specific contacts should be notified when additional information is needed. The additional information needed is listed in the comment section.",
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
          "description": "Specific contacts should be notified when inspection is scheduled.",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [],
          "status": []
        },
        "action": {
          "notificationTemplate": "SS_INSPECTION_SCHEDULED",
          "notificationReport": [],
          "notifyContactTypes": [
            "Business Entity"
          ]
        },
        "postScript": ""
      }
    ],
    "InspectionResultSubmitAfter": [
      {
        "metadata": {
          "description": "Specific contacts should be notified when an inspection is resulted..",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [],
          "status": []
        },
        "action": {
          "notificationTemplate": "SS_INSPECTION_RESULT",
          "notificationReport": [
            "Inspection Result Ticket"
          ],
          "reportParamContactType": "Business Entity",
          "notifyContactTypes": [
            "Business Entity"
          ]
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Combo/*/Application": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "Specific contacts should be notified when an application has been denied.",
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
          "description": "Specific contacts should be notified when an application has been withdrawn.",
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
          "description": "Specific contacts should be notified when a license is issued.",
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
  },
  "Cannabis/Combo/*/License": {
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
      },
      {
        "metadata": {
          "description": "Specific contacts should be notified when license has been renewed and license form attached",
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
            "Cannabis License Form"
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