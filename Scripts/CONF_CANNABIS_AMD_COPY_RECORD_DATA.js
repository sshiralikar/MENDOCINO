{
  "Cannabis/Amendment/License Modification/NA": {
    "Pageflow": [
      {
        "preScript": "",
        "metadata": {
          "description": "Pageflow copy License Amendment Contact Info",
          "operators": {}
        },
        "criteria": {
          "recordType": "Cannabis/*/*/License"
        },
        "action": {
          "Renewal": false,
          "usageType": "copyFromParent",
          "CONTACTS": [
            "ALL"
          ],
          "ASI": [],
          "ASIT": [],
          "CONDITIONS": [
            "ALL"
          ],
          "ADDRESS": [
            "ALL"
          ],
          "LICENSEDPROFESSIONALS": [],
          "ASSETS": [],
          "keepExistingAPO": false,
          "RECORDDETAILS": false,
          "RECORDNAME": true,
          "PARCEL": false,
          "OWNER": false,
          "ADDITIONALINFO": false,
          "EDUCATION": false,
          "CONTEDUCATION": false,
          "EXAM": false,
          "DOCUMENT": false
        },
        "postScript": ""
      }
    ],
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Copy License Amendment Contact Info on Workflow Task Modification Review - Status Modification Request Approved",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Modification Review"
          ],
          "status": [
            "Modification Request Approved"
          ],
          "recordType": "Cannabis/*/*/License"
        },
        "action": {
          "usageType": "copyToParent",
          "Renewal": false,
          "CONTACTS": [
            "ALL"
          ],
          "ASI": [],
          "ASIT": [],
          "CONDITIONS": [
            "ALL"
          ],
          "ADDRESS": [],
          "LICENSEDPROFESSIONALS": [],
          "ASSETS": [],
          "keepExistingAPO": false,
          "RECORDDETAILS": false,
          "RECORDNAME": false,
          "PARCEL": false,
          "OWNER": false,
          "ADDITIONALINFO": false,
          "EDUCATION": false,
          "CONTEDUCATION": false,
          "EXAM": false,
          "DOCUMENT": false
        },
        "postScript": ""
      }
    ]
  },
  "Licenses/Amendment/Change of Ownership/NA": {
    "Pageflow": [
      {
        "preScript": "",
        "metadata": {
          "description": "Pageflow copy License",
          "operators": {}
        },
        "criteria": {
          "recordType": "Cannabis/*/*/License"
        },
        "action": {
          "usageType": "copyFromParent",
          "Renewal": false,
          "CONTACTS": [
            "Business Entity",
            "Business Owner"
          ],
          "ASI": [],
          "ASIT": [],
          "CONDITIONS": [
            "ALL"
          ],
          "ADDRESS": [
            "ALL"
          ],
          "LICENSEDPROFESSIONALS": [],
          "ASSETS": [],
          "keepExistingAPO": false,
          "RECORDDETAILS": true,
          "RECORDNAME": true,
          "PARCEL": false,
          "OWNER": false,
          "ADDITIONALINFO": false,
          "EDUCATION": false,
          "CONTEDUCATION": false,
          "EXAM": false,
          "DOCUMENT": false
        },
        "postScript": ""
      }
    ],
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Copy License Amendment",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Modification Review"
          ],
          "status": [
            "Modification Request Approved"
          ],
          "recordType": "Cannabis/*/*/License"
        },
        "action": {
          "usageType": "copyToParent",
          "Renewal": false,
          "CONTACTS": [
            "Business Entity",
            "Business Owner"
          ],
          "ASI": [],
          "ASIT": [],
          "CONDITIONS": [
            "ALL"
          ],
          "ADDRESS": [],
          "LICENSEDPROFESSIONALS": [],
          "ASSETS": [],
          "keepExistingAPO": false,
          "RECORDDETAILS": false,
          "RECORDNAME": false,
          "PARCEL": false,
          "OWNER": false,
          "ADDITIONALINFO": false,
          "EDUCATION": true,
          "CONTEDUCATION": true,
          "EXAM": true,
          "DOCUMENT": false
        },
        "postScript": ""
      }
    ]
  },
  "Licenses/Amendment/Modification of Premises/NA": {
    "Pageflow": [
      {
        "preScript": "",
        "metadata": {
          "description": "Pageflow copy License Amend Prem",
          "operators": {}
        },
        "criteria": {
          "recordType": "Cannabis/*/*/License"
        },
        "action": {
          "usageType": "copyFromParent",
          "Renewal": false,
          "CONTACTS": [
            "ALL"
          ],
          "ASI": [],
          "ASIT": [],
          "CONDITIONS": [
            "ALL"
          ],
          "ADDRESS": [
            "ALL"
          ],
          "LICENSEDPROFESSIONALS": [],
          "ASSETS": [],
          "keepExistingAPO": false,
          "RECORDDETAILS": true,
          "RECORDNAME": true,
          "PARCEL": false,
          "OWNER": false,
          "ADDITIONALINFO": false,
          "EDUCATION": false,
          "CONTEDUCATION": false,
          "EXAM": false,
          "DOCUMENT": false
        },
        "postScript": ""
      }
    ],
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Copy License Amendment Workflow Task Modification ",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Decision Modification"
          ],
          "status": [
            "Modification Request Approved"
          ],
          "recordType": "Cannabis/*/*/License"
        },
        "action": {
          "usageType": "copyToParent",
          "Renewal": false,
          "CONTACTS": [
            "ALL"
          ],
          "ASI": [],
          "ASIT": [],
          "CONDITIONS": [
            "ALL"
          ],
          "ADDRESS": [],
          "LICENSEDPROFESSIONALS": [],
          "ASSETS": [],
          "keepExistingAPO": false,
          "RECORDDETAILS": false,
          "RECORDNAME": false,
          "PARCEL": false,
          "OWNER": false,
          "ADDITIONALINFO": false,
          "EDUCATION": true,
          "CONTEDUCATION": true,
          "EXAM": true,
          "DOCUMENT": false
        },
        "postScript": ""
      }
    ]
  }
}