{
  "aboutToExpireSearchRules": {
    "searchCriteria": {
	      "searchByRecordGroup":"Cannabis",
	      "searchByRecordType":"Medical",
	      "searchByRecordSubType":"",
	      "searchByRecordCategory":"License",
	      "searchStatus": "About to Expire",
	      "searchByDaysOut": 30,
	      "searchByFromDate": false,
	      "searchByToDate": false,
	      "expiringInterval":"nextquarter",
	      "notificationConfScript":"CONF_CANNABIS_MD_LICENSE_EXPIRATION_NOTICE",
	      "firstNotice": "30 Day Notice",
	      "excludeRecordType": [{
	          "type": "Licenses/Type/Subtype/Category"
	        },
	        {
	          "type": "Licenses/Type/Subtype/Category"
	        }
	      ],
	      "excludeRecordStatus": [{
	          "status": "Revoked"
	        },
	        {
	          "status": "Closed"
	        }
	      ],
	      "adminEmail": "",
	      "batchResultEmailTemplate": "BATCH_LICENSE_RENEWAL_RESULTS"
	    }
  }
}