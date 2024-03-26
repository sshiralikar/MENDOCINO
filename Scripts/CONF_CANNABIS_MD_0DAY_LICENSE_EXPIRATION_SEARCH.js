{
  "aboutToExpireSearchRules": {
    "searchCriteria": {
	 "searchByRecordGroup":"Cannabis",
      "searchByRecordType":"Medical",
      "searchByRecordSubType":"",
      "searchByRecordCategory":"License",
      "searchStatus": "About to Expire",
      "searchByDaysOut": 0,
      "searchByFromDate": false,
      "searchByToDate": false,
      "expiringInterval":"thismonth",
      "notificationConfScript":"CONF_CANNABIS_MD_LICENSE_EXPIRATION_NOTICE",
      "firstNotice": "Expiration Notice",
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