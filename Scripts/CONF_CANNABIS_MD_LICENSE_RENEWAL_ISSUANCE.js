{
  "Cannabis/Medical/*/*": {
    "WorkflowTaskUpdateAfter": [
      {
        "metadata": {
          "description": "License renewal",
          "operators": {
          }
        },
        "criteria": {
          "task": ["Renewal"],
          "status": ["Renewed"]
        },
        "preScript": "",
        "action": {
          "issuedRecordStatus": "Active",
          "issuedExpirationStatus": "Active",
          "issuedLPStatus": "",
          "expirationType": "Days",
          "expirationPeriod": "356",
          "customExpirationFunction": "",
          "copyComponents": [
            
          ]
        },
        "postScript": ""
      }
    ]
  }
}