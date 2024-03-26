{
"aboutToExpireSearchRules": {
    "searchCriteria": {
      "searchByRecordGroup":"Cannabis",
      "searchByRecordType":"Medical",
      "searchByRecordSubType":"",
      "searchByRecordCategory":"License",
      "searchStatus": "Expired",
      "searchByDaysOut": -60,
      "searchByFromDate": false,
      "searchByToDate": false,
      "expiringInterval":"thisquarter",
      "notificationConfScript":"CONF_CANNABIS_MD_LICENSE_EXPIRATION_NOTICE",
      "firstNotice": "60 Day Expired",
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