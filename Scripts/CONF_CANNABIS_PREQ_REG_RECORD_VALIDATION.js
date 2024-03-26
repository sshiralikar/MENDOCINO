{
  "Cannabis/Entity/Registration/*": {
    "ApplicationSubmitBefore": [
      {
        "metadata": {
          "description": "Rule for all Cannabis Registrations",
          "operators": {}
        },
        "preScript": " ",
        "criteria": {
          "task": [
            "Registration"
          ],
          "status": [
            "Registered",
            "Registered with Conditions"
          ],
          "allowBalance": false
        },
        "action": {
          "validationMessage": "This action cannot be taken until all outstanding fees are paid in full."
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Entity/Prequalification/Application": {
    "ApplicationSubmitBefore": [
      {
        "metadata": {
          "description": "On Cannabis/Entity/Prequalification/Application, IF task = 'Background Investigation' and status change = 'Approved' or 'Not Required', check for related Registration records (Cannabis/Entity/Registration/*). If the related Registration records do not have an Application Status = 'Registered', or 'Withdrawn', prevent Background Investigation status change to Approved or Not Required and send message: 'There are outstanding registrations and/or background checks. These must be completed before proceeding to the Review Stage.",
          "operators": {
            "childRecordStatus": "!="
          }
        },
        "preScript": " ",
        "criteria": {
          "task": [
            "Background Investigation"
          ],
          "status": [
            "Approved",
            "Not Required"
          ],
          "allowBalance": true,
          "chkInvoicedFees": true,
          "childRequired": [
            "Cannabis/Entity/Registration/Individual",
            "Cannabis/Entity/Registration/Business",
            "Cannabis/Entity/Registration/Employee"
          ],
          "childRecordStatus": [
            "Registered",
            "Registered with Conditions",
            "Withdrawn"
          ]
        },
        "action": {
          "validationMessage": "There are outstanding registrations and/or background checks. These must be completed before proceeding to the Review Stage."
        },
        "postScript": ""
      },
      [
        {
          "metadata": {
            "description": "Rule for Pre-qualification Cannabis application",
            "operators": {}
          },
          "preScript": " ",
          "criteria": {
            "task": [
              "Application Issuance"
            ],
            "status": [
              "Approved"
            ],
            "allowBalance": false
          },
          "action": {
            "validationMessage": "This action cannot be taken until all outstanding fees are paid in full."
          },
          "postScript": ""
        }
      ]
    ]
  }
}