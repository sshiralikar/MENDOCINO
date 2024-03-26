{
  "Cannabis/Entity/Prequalification/Application": {
    "Pageflow": [
      {
        "preScript": " ",
        "metadata": {
          "description": "required documents",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Owned, Leased, or Optioned": [
              "Option to Purchase",
              "Leased",
              "Option to Lease"
            ]
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
          "description": "required documents",
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
          "description": "required documents",
          "operators": {}
        },
        "criteria": {
          "customLists": [
            {
              "tableName": "MJ_LICENSURE TYPE",
              "columnName": "License Category",
              "value": [
                "Medicinal Use",
                "Combo",
                "Adult-Use"
              ]
            }
          ]
        },
        "action": {
          "requiredDocuments": [
            "Certificate of Good Standing",
            "Equity Ownership Information Description Document",
            "Indemnification Agreement",
            "Plan - Business Plan",
            "Plan - Site Plan",
            "State Cannabis Business License"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "Corporation Ownership Type required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Business Ownership Type": "Corporation"
          }
        },
        "action": {
          "requiredDocuments": [
            "Articles of Incorporation/Organization",
            "Statement of Information"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "LLC Ownership Type required document",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Business Ownership Type": "LLC"
          }
        },
        "action": {
          "requiredDocuments": [
            "Articles of Incorporation/Organization",
            "Statement of Information"
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
  "Cannabis/Entity/Registration/Business": {
    "Pageflow": [
      {
        "preScript": " ",
        "metadata": {
          "description": "required documents",
          "operators": {}
        },
        "criteria": {},
        "action": {
          "requiredDocuments": [
            "Certificate of Good Standing",
            "Equity Ownership Information Description Document"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "required documents",
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
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "required documents",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Applicant or other key persons had a privileged license denied, revoked or suspended?": "Yes"
          }
        },
        "action": {
          "requiredDocuments": [
            "Statement of Information"
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
  "Cannabis/Entity/Registration/Individual": {
    "Pageflow": [
      {
        "preScript": " ",
        "metadata": {
          "description": "required documents",
          "operators": {}
        },
        "criteria": {},
        "action": {
          "requiredDocuments": [
            "Copy of Valid Form of ID"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "required documents",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Applicant has past crime convictions": "Yes"
          }
        },
        "action": {
          "requiredDocuments": [
            "List and Explanation of Offense(s)"
          ],
          "requirementType": "CONDITION",
          "validationMessage": "Documents are Required"
        },
        "postScript ": " "
      },
      {
        "preScript": " ",
        "metadata": {
          "description": "required documents",
          "operators": {}
        },
        "criteria": {
          "customFields": {
            "Applicant had a privileged license revoked or suspended?": "Yes"
          }
        },
        "action": {
          "requiredDocuments": [
            "Statement of Information"
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
  }
}