{
  "aboutToExpireSearchRules": {
    "searchCriteria": {
      "searchByRecordGroup":"Cannabis",
      "searchByRecordType":"Combo",
      "searchByRecordSubType":"*",
      "searchByRecordCategory":"License",
      "searchStatus": "Active",
      "searchByDaysOut": 60,
      "searchByFromDate": false,
      "searchByToDate": false,
      "expiringInterval":"nextquarter",
      "notificationConfScript":"CONF_CANNABIS_COMBO_LICENSE_EXPIRATION_NOTICE",
      "firstNotice": "60 Day Notice",
      "excludeRecordType": [ ],
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
  },
  "expirationNoticeSearchRules": {
    "searchCriteria": {
      "searchByRecordGroup": "Cannabis",
      "searchByRecordType": "Combo",
      "searchByRecordSubType": "*",
      "searchByRecordCategory": "License",
      "searchByRecordStatus": "",
      "searchByDaysOut": 1,
      "searchByFromDate": false,
      "searchByToDate": false,
      "notificationConfScript": "CONF_CANNABIS_COMBO_LICENSE_EXPIRATION_NOTICE",
      "excludeRecordType": [],
      "excludeRecordStatus": [
        {
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