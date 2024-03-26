{
  "Cannabis/Entity/Prequalification/Application": {
    "ApplicationSubmitAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Update the application name to be the Business Entity",
          "operators": {}
        },
        "criteria": {},
        "action": {
          "updateAppName": {
            "includeAddress": true,
            "addressType": "",
            "contactType": "Business Entity",
            "includeContactName": false,
            "includeBusinessName": true,
            "includeDBATradeName": false
          }
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Entity/Registration/Individual": {
    "ApplicationSubmitAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Update the application name Affiliate Individual",
          "operators": {}
        },
        "criteria": {},
        "action": {
          "updateAppName": {
            "includeAddress": false,
            "addressType": "",
            "contactType": "Affiliate Individual",
            "includeContactName": true,
            "includeBusinessName": false,
            "includeDBATradeName": false
          }
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Entity/Registration/Business": {
    "ApplicationSubmitAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Update the application name to be the Affiliate Business",
          "operators": {}
        },
        "criteria": {},
        "action": {
          "updateAppName": {
            "includeAddress": true,
            "addressType": "",
            "contactType": "Affiliate Business",
            "includeContactName": false,
            "includeBusinessName": true,
            "includeDBATradeName": false
          }
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Entity/Registration/Employee": {
    "ApplicationSubmitAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Update the application name to be Employee",
          "operators": {}
        },
        "criteria": {
          "contactType": "Employee"
        },
        "action": {
          "updateAppName": {
            "includeAddress": false,
            "addressType": "",
            "": "",
            "contactType": "Employee",
            "includeContactName": true,
            "includeBusinessName": false,
            "includeDBATradeName": false
          }
        },
        "postScript": ""
      },
      {
        "preScript": "",
        "metadata": {
          "description": "Update the application name to be Volunteer",
          "operators": {}
        },
        "criteria": {
          "contactType": "Volunteer"
        },
        "action": {
          "updateAppName": {
            "includeAddress": false,
            "addressType": "",
            "": "",
            "contactType": "Volunteer",
            "includeContactName": true,
            "includeBusinessName": false,
            "includeDBATradeName": false
          }
        },
        "postScript": ""
      },
      {
        "preScript": "",
        "metadata": {
          "description": "Update the application name to be Independent Contractor",
          "operators": {}
        },
        "criteria": {
          "contactType": "Independent Contractor"
        },
        "action": {
          "updateAppName": {
            "includeAddress": false,
            "addressType": "",
            "": "",
            "contactType": "Independent Contractor",
            "includeContactName": true,
            "includeBusinessName": false,
            "includeDBATradeName": false
          }
        },
        "postScript": ""
      }
    ]
  }
}