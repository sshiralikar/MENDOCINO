{
"Cannabis/Adult-Use/Cultivation/Application": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Create Transaction License Record and  copy data from Application to License.",
          "operators": {
          }
        },
        "criteria": {
          "task": [
            "License Issuance"
          ],
          "status": [
            "Issued"
          ]
        },
        "action": {
          "parentLicense": "Cannabis/Adult-Use/Cultivation/License",
          "issuedStatus": "Active",
          "copyCustomFields": ["ALL"],
          "copyCustomTables": ["ALL"],
          "expirationType": "Expiration Code",
          "expirationPeriod": "MJ_General",
          "copyContacts": ["ALL"],
          "createLP": true,
          "licenseTable": "",
          "refLPType": "Business",
          "contactType": "Business Entity",
          "contactAddressType": "Business"
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Adult-Use/Dispensary/Application": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Create Transaction License Record and  copy data from Application to License.",
          "operators": {
          }
        },
        "criteria": {
          "task": [
            "License Issuance"
          ],
          "status": [
            "Issued"
          ]
        },
        "action": {
          "parentLicense": "Cannabis/Adult-Use/Dispensary/License",
          "issuedStatus": "Active",
          "copyCustomFields": ["ALL"],
          "copyCustomTables": ["ALL"],
          "expirationType": "Expiration Code",
          "expirationPeriod": "MJ_General",
          "copyContacts": ["ALL"],
          "createLP": true,
          "licenseTable": "",
          "refLPType": "Business",
          "contactType": "Business Entity",
          "contactAddressType": "Business"
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Adult-Use/Manufacturer/Application": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Create Transaction License Record and  copy data from Application to License.",
          "operators": {
          }
        },
        "criteria": {
          "task": [
            "License Issuance"
          ],
          "status": [
            "Issued"
          ]
        },
        "action": {
          "parentLicense": "Cannabis/Adult-Use/Manufacturer/License",
          "issuedStatus": "Active",
          "copyCustomFields": ["ALL"],
          "copyCustomTables": ["ALL"],
          "expirationType": "Expiration Code",
          "expirationPeriod": "MJ_General",
          "copyContacts": ["ALL"],
          "createLP": true,
          "licenseTable": "",
          "refLPType": "Business",
          "contactType": "Business Entity",
          "contactAddressType": "Business"
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Adult-Use/Optional Prem Culti/Application": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Create Transaction License Record and  copy data from Application to License.",
          "operators": {
          }
        },
        "criteria": {
          "task": [
            "License Issuance"
          ],
          "status": [
            "Issued"
          ]
        },
        "action": {
          "parentLicense": "Cannabis/Adult-Use/Optional Prem Culti/License",
          "issuedStatus": "Active",
          "copyCustomFields": ["ALL"],
          "copyCustomTables": ["ALL"],
          "expirationType": "Expiration Code",
          "expirationPeriod": "MJ_General",
          "copyContacts": ["ALL"],
          "createLP": true,
          "licenseTable": "",
          "refLPType": "Business",
          "contactType": "Business Entity",
          "contactAddressType": "Business"
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Adult-Use/Processor/Application": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Create Transaction License Record and  copy data from Application to License.",
          "operators": {
          }
        },
        "criteria": {
          "task": [
            "License Issuance"
          ],
          "status": [
            "Issued"
          ]
        },
        "action": {
          "parentLicense": "Cannabis/Adult-Use/Processor/License",
          "issuedStatus": "Active",
          "copyCustomFields": ["ALL"],
          "copyCustomTables": ["ALL"],
          "expirationType": "Expiration Code",
          "expirationPeriod": "MJ_General",
          "copyContacts": ["ALL"],
          "createLP": true,
          "licenseTable": "",
          "refLPType": "Business",
          "contactType": "Business Entity",
          "contactAddressType": "Business"
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Adult-Use/Transport/Application": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Create Transaction License Record and  copy data from Application to License.",
          "operators": {
          }
        },
        "criteria": {
          "task": [
            "License Issuance"
          ],
          "status": [
            "Issued"
          ]
        },
        "action": {
          "parentLicense": "Cannabis/Adult-Use/Transport/License",
          "issuedStatus": "Active",
          "copyCustomFields": ["ALL"],
          "copyCustomTables": ["ALL"],
          "expirationType": "Expiration Code",
          "expirationPeriod": "MJ_General",
          "copyContacts": ["ALL"],
          "createLP": true,
          "licenseTable": "",
          "refLPType": "Business",
          "contactType": "Business Entity",
          "contactAddressType": "Business"
        },
        "postScript": ""
      }
    ]
  },
  "Cannabis/Adult-Use/Delivery-Only/Application": {
	    "WorkflowTaskUpdateAfter": [
	      {
	        "preScript": "",
	        "metadata": {
	          "description": "Create Delivery-Only License Record and  copy data from Application to License.",
	          "operators": {
	          }
	        },
	        "criteria": {
	          "task": [
	            "License Issuance"
	          ],
	          "status": [
	            "Issued"
	          ]
	        },
	        "action": {
	          "parentLicense": "Cannabis/Adult-Use/Delivery-Only/License",
	          "issuedStatus": "Active",
	          "copyCustomFields": ["ALL"],
	          "copyCustomTables": ["ALL"],
	          "expirationType": "Expiration Code",
	          "expirationPeriod": "MJ_General",
	          "copyContacts": ["ALL"],
	          "createLP": true,
	          "licenseTable": "",
	          "refLPType": "Business",
	          "contactType": "Business Entity",
	          "contactAddressType": "Business"
	        },
	        "postScript": ""
	      }
	    ]
	  }
}