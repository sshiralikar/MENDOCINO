{
  "Cannabis/Entity/*/*": {
    "ApplicationSubmitAfter": [
      {
        "metadata": {
          "description": "To automate creation and updating of reference contacts for Businesses on ASA for back office users",
          "operators": {}
        },
        "criteria": {
          
        },
        "preScript": "",
        "action": {
          "contactTypes": [
            "Authorized Agent",
            "Affiliate Individual",
            "Employee",
            "Independent Contractor" ,
			"Volunteer"
          ],
          "createReferenceContacts": true,
          "updateReferenceContacts": true,
          "compareFunction": "comparePeopleMatchCriteria",
          "referenceContactType": "Individual",
          "licensedProfessionalType": "",
          "createReferenceLicense": false,
          "updatedReferenceLicense": false,
          "createPublicUser": false,
          "linkPublicUserReferenceContact": false,
          "linkPublicUserReferenceLicense": false,
          "addAKANamesFromContactTemplateTable": ""
        },
        "postScript": ""
      },
      {
        "metadata": {
          "description": "To automate creation and updating of reference contacts for Businesses on ASA for back office users",
          "operators": {}
        },
        "criteria": {
         
        },
        "preScript": "",
        "action": {
          "contactTypes": [
            "Business Entity" ,
			"Affiliate Business"
          ],
          "createReferenceContacts": true,
          "updateReferenceContacts": true,
          "compareFunction": "comparePeopleMatchCriteria",
          "referenceContactType": "Organization",
          "licensedProfessionalType": "",
          "createReferenceLicense": false,
          "updatedReferenceLicense": false,
          "createPublicUser": false,
          "linkPublicUserReferenceContact": false,
          "linkPublicUserReferenceLicense": false,
          "addAKANamesFromContactTemplateTable": ""
		  
        },
        "postScript": ""
      }
    ],
    "ConvertToRealCAPAfter": [
      {
        "metadata": {
          "description": "To automate creation and updating of reference contacts on CTRCA for Public Users",
          "operators": {}
        },
        "criteria": {},
        "preScript": "",
        "action": {
          "contactTypes": [
            "Authorized Agent",
            "Affiliate Individual",
            "Employee",
            "Independent Contractor" ,
			"Volunteer"
          ],
          "createReferenceContacts": true,
          "updateReferenceContacts": true,
          "compareFunction": "comparePeopleMatchCriteria",
          "referenceContactType": "Individual",
          "licensedProfessionalType": "",
          "createReferenceLicense": false,
          "updatedReferenceLicense": false,
          "createPublicUser": false,
          "linkPublicUserReferenceContact": false,
          "linkPublicUserReferenceLicense": false,
          "addAKANamesFromContactTemplateTable": ""
        },
        "postScript": ""
      },
      {
        "metadata": {
          "description": "To automate creation and updating of reference contacts for Businesses on CTRCA for Public Users",
          "operators": {}
        },
        "criteria": {},
        "preScript": "",
        "action": {
          "contactTypes": [
             "Business Entity" ,
			"Affiliate Business"
          ],
          "createReferenceContacts": true,
          "updateReferenceContacts": true,
          "compareFunction": "comparePeopleMatchCriteria",
          "referenceContactType": "Organization",
          "licensedProfessionalType": "",
          "createReferenceLicense": false,
          "updatedReferenceLicense": false,
          "createPublicUser": false,
          "linkPublicUserReferenceContact": false,
          "linkPublicUserReferenceLicense": false,
          "addAKANamesFromContactTemplateTable": ""
        },
        "postScript": ""
      }
    ]
  }
}