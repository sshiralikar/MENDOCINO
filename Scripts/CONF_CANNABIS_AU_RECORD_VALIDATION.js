{
  "Cannabis/Adult-Use/*/*": {
    "WorkflowTaskUpdateBefore": [
      {
        "metadata": {
          "description": "Cannabis licenses cannot be issued until all fees have been paid",
          "operators": {
            
          }
        },
        "preScript": "",
        "criteria": {
          "task": [
            "License Issuance"
          ],
          "status": [
            "Issued"
          ],
          "allowBalance": false
        },
        "action": {
          "validationMessage": "This action cannot be taken until all outstanding fees are paid in full."
        },
        "postScript": ""
      },
      {
          "metadata": {
            "description": "Cannabis Inspections cannot be issued until all fees have been paid",
            "operators": {
              
            }
          },
          "preScript": "",
          "criteria": {
            "task": [
              "Inspections"
            ],
            "status": [
              "Passed"
            ],
            "allowBalance": false
          },
          "action": {
            "validationMessage": "This action cannot be taken until all outstanding fees are paid in full."
          },
          "postScript": ""
        }
    ]
  }
}