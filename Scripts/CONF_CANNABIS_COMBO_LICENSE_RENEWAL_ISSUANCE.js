{
  "Cannabis/Combo/*/*": {
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
          "issuedLPStatus": "A",     
          "expirationType": "Expiration Code",
          "expirationPeriod": "",
          "customExpirationFunction": "",
          "copyComponents": [
            "Contacts",
			"Custom Fields",
			"Custom Lists"
           ]
        },
        "postScript": ""
      }
    ]
  }
}
