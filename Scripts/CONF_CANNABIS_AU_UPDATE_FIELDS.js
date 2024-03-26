{
  "Cannabis/Adult-Use/*/Application": {
    "ApplicationSubmitAfter": [
      {
        "preScript": "",
        "metadata": {
          "description": "Update the application name to be the Business Entity",
          "operators": {
            
          }
        },
        "criteria": {
          "customFields": {
          },
          "customLists": [
          ],
          "task": [
          ],
          "status": [
          ]
        },
        "action": {
        	"daysOut": "",
            "valueSource": "",
            "sourceName": "",
            "customFieldToUpdate": "",
            "customListToUpdate": "",
  		  	"asitSearchColumn": "",
  		  	"updateAppName":{
  		  		"includeAddress" : true,
      			"addressType": "",
      			"contactType" : "Business Entity",
      			"includeContactName" : false,
      			"includeBusinessName" : true,
      			"includeDBATradeName" : false
  		  	}
        },
        "postScript": ""
      }
    ]
  }
}