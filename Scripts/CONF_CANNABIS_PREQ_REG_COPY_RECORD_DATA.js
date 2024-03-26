{
	"Cannabis/Amendment/*/*": {
    "Pageflow": [
      {
        "preScript": "",
        "metadata": {
          "description": "When an amendment is created, Copy data from parent record and populate in ACA pageflow",
          "operators": {}
        },
        "criteria": {
          "recordType": "Cannabis/Entity/*/*"
        },
        "action": {
          "preScript": "",
          "usageType": "copyFromParent",
          "CONTACTS": [
            "ALL"
          ],
          "ASI": [
            "ALL"
          ],
          "ASIT": [
            "ALL"
          ],
          "CONDITIONS": [
            "ALL"
          ],
          "ADDRESS": [
            "ALL"
          ],
          "LICENSEDPROFESSIONALS": [
            "ALL"
          ],
          "ASSETS": [
            "ALL"
          ],
          "keepExistingAPO": true,
          "RECORDDETAILS": true,
          "RECORDNAME": true,
          "PARCEL": true,
          "OWNER": true,
          "ADDITIONALINFO": true,
          "EDUCATION": true,
          "CONTEDUCATION": true,
          "EXAM": true,
          "DOCUMENT": true
        },
        "postScript": ""
      }
    ],    
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "When an amendment is approved, Copy data to the parent record",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Modification Review"
          ],
          "status": [
            "Modification Request Approved"
          ],          
          "recordType": "Cannabis/Entity/*/*"
        },
        "action": {
          "usageType": "copyToParent",
          "CONTACTS": [
            "ALL"
          ],
          "ASI": [
            "ALL"
          ],
          "ASIT": [
            "ALL"
          ],
          "CONDITIONS": [
            "ALL"
          ],
          "ADDRESS": [
            "ALL"
          ],
          "LICENSEDPROFESSIONALS": [
            "ALL"
          ],
          "ASSETS": [
            "ALL"
          ],
          "keepExistingAPO": true,
          "RECORDDETAILS": true,
          "RECORDNAME": true,
          "PARCEL": true,
          "OWNER": true,
          "ADDITIONALINFO": true,
          "EDUCATION": true,
          "CONTEDUCATION": true,
          "EXAM": true,
          "DOCUMENT": true
        },
        "postScript": ""
      }
    ]
  }
}