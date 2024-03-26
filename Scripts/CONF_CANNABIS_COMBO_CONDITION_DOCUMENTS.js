{
  "Cannabis/Combo/*/Application": {
    "Pageflow": [
      {
        "preScript": " ",
        "metadata": {
          "description": "Leased Ownership Type required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Owned, Leased, or Optioned": "Leased"
          }
        },
        "action": {
          "requiredDocuments": [
            "Property Owner Consent Form",
            "Lease or Option"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "Option to Lease Ownership Type required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Owned, Leased, or Optioned": "Option to Lease"
          }
        },
        "action": {
          "requiredDocuments": [
            "Property Owner Consent Form",
            "Lease or Option"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "Option to Purchase Ownership Type required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Owned, Leased, or Optioned": "Option to Purchase"
          }
        },
        "action": {
          "requiredDocuments": [
            "Property Owner Consent Form",
            "Lease or Option"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "Owned Ownership Type required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Owned, Leased, or Optioned": "Owned"
          }
        },
        "action": {
          "requiredDocuments": [
            "Title or Deed"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "legal possession of the premises required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Applicant has legal possession of the premises": "No"
          }
        },
        "action": {
          "requiredDocuments": [
            "Property Owner Consent Form"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      }
    ],
    "DocumentUploadAfter": [
      {
        "preScript": " ",
        "metadata": {
          "description": "Update Document Categories",
          "operators": {}
        },
        "criteria": {
          "customLists": []
        },
        "action": {
          "requiredDocuments": [],
          "updateDocumentCategories": true
        },
        "postScript ": " "
      }
    ]
  },
  "Cannabis/Combo/*/Renewal": {
    "Pageflow": [
      {
        "preScript": " ",
        "metadata": {
          "description": "Renewal required document",
          "operators": {}
        },
        "criteria": {},
        "action": {
          "requiredDocuments": [
            "Insurance Information"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "legal possession of the premises required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Applicant has legal possession of the premises": "No"
          }
        },
        "action": {
          "requiredDocuments": [
            "Property Owner Consent Form"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "Leased Ownership Type required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Owned, Leased, or Optioned": "Leased"
          }
        },
        "action": {
          "requiredDocuments": [
            "Property Owner Consent Form",
            "Lease or Option"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "Option to Lease Ownership Type required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Owned, Leased, or Optioned": "Option to Lease"
          }
        },
        "action": {
          "requiredDocuments": [
            "Property Owner Consent Form",
            "Lease or Option"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "Option to Purchase Ownership Type required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Owned, Leased, or Optioned": "Option to Purchase"
          }
        },
        "action": {
          "requiredDocuments": [
            "Property Owner Consent Form",
            "Lease or Option"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "Owned Ownership Type required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Owned, Leased, or Optioned": "Owned"
          }
        },
        "action": {
          "requiredDocuments": [
            "Title or Deed"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "Criminal Offenses",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Applicant or other key persons have Criminal Offenses?": "Yes"
          }
        },
        "action": {
          "requiredDocuments": [
            "List and Explanation of Offense(s)"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "List and Explanation of Offense(s)documents is required"
        },
        "postScript ": " "
      }
    ]
  }
}