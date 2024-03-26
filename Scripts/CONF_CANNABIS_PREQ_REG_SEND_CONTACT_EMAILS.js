{
  "Cannabis/Entity/Registration/Business": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "Sends Email Template to necessary Contact Types with available parameters",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [
            "Registration"
          ],
          "status": [
            "Registered with Conditions",
            "Registered"
          ]
        },
        "action": {
          "notificationTemplate": "SS_REGISTRATION_COMPLETE",
          "notificationReport": [],
          "notifyContactTypes": [
            "Affiliate Business"
          ]
        },
        "postScript": ""
      },
      {
        "metadata": {
          "description": "Sends Email Template to necessary Contact Types with available parameters",
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
            "Affiliate Individual",
            "Business Entity"
          ]
        },
        "postScript": ""
      },
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
            "Affiliate Business"
          ]
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Entity/Prequalification/Application": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "Sends Email Template to necessary Contact Types with available parameters",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [
            "Application Issuance"
          ],
          "status": [
            "Approved"
          ]
        },
        "action": {
          "notificationTemplate": "SS_PREQUAL_APPROVED",
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
          "description": "Sends Accepted Email Template to necessary Contact Types with available parameters",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [
            "Application Intake"
          ],
          "status": [
            "Accepted"
          ]
        },
        "action": {
          "notificationTemplate": "MJ_AFFILIATE_REGISTRATION",
          "notificationReport": [],
          "notifyContactTypes": [
            "Affiliate Individual",
            "Affiliate Business"
          ],
          "additionalEmailsTo": ""
        },
        "postScript": ""
      },
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
    ]
  },
  "Cannabis/Entity/Registration/Individual": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "Sends Email Template to necessary Contact Types with available parameters",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [
            "Registration"
          ],
          "status": [
            "Registered with Conditions",
            "Registered"
          ]
        },
        "action": {
          "notificationTemplate": "SS_REGISTRATION_COMPLETE",
          "notificationReport": [],
          "notifyContactTypes": [
            "Affiliate Individual"
          ]
        },
        "postScript": ""
      },
      {
        "metadata": {
          "description": "Sends Email Template to necessary Contact Types with available parameters",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [
            "Registration"
          ],
          "status": [
            "Registered with Conditions",
            "Registered"
          ]
        },
        "action": {
          "notificationTemplate": "SS_REGISTRATION_COMPLETE",
          "notificationReport": [],
          "notifyContactTypes": [
            "Affiliate Individual"
          ]
        },
        "postScript": ""
      },
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
            "Affiliate Individual"
          ]
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Entity/Registration/Employee": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "Sends Email Template to necessary Contact Types with available parameters",
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
            "Employee",
            "Business Entity"
          ]
        },
        "postScript": ""
      },
      {
        "metadata": {
          "description": "Sends Email Template to necessary Contact Types with available parameters",
          "operators": {}
        },
        "preScript": "",
        "criteria": {
          "task": [
            "Registration"
          ],
          "status": [
            "Registered with Conditions",
            "Registered"
          ]
        },
        "action": {
          "notificationTemplate": "SS_REGISTRATION_COMPLETE",
          "notificationReport": [],
          "notifyContactTypes": [
            "Employee",
            "Volunteer"
          ]
        },
        "postScript": ""
      },
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
            "Employee",
            "Volunteer",
            "Independent Contractor"
          ]
        },
        "postScript": ""
      }
    ]
  }
}