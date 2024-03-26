{
	"Cannabis/Adult-Use/*/License": {
		"60 Day Notice": {
			"notificationTemplate": "SS_LICENSE_ABOUT_TO_EXPIRE",
			"notificationReport": false,
			"notifyContactTypes": "Authorized Agent, Business Entity",
			"mailerSetType": "Renewal",
			"mailerSetStatus": "Open",
			"mailerSetPrefix": "LIC_ABOUT_TO_EXPIRE",
			"updateExpirationStatus": "About to Expire",
			"updateRecordStatus": false,
			"updateWorkflowTask": false,
			"updateWorkflowStatus": false,
			"nextNotificationDays": 30,
			"nextNotification": "30 Day Notice"
		},
		"30 Day Notice": {
			"notificationTemplate": "SS_LIC_EXPIRATION_30_DAY_NOTICE",
			"notificationReport": false,
			"notifyContactTypes": "Authorized Agent, Business Entity",
			"mailerSetType": "Renewal",
			"mailerSetStatus": "Open",
			"mailerSetPrefix": "LIC_EXPIRATION_30_DAY_NOTICE",
			"updateExpirationStatus": false,
			"updateRecordStatus": false,
			"updateWorkflowTask": false,
			"updateWorkflowStatus": false,
			"nextNotificationDays": 30,
			"nextNotification": "Expiration Notice"
		},
		"Expiration Notice": {
			"notificationTemplate": "SS_LIC_EXPIRATION_FINAL_NOTICE",
			"notificationReport": false,
			"notifyContactTypes": "Authorized Agent, Business Entity",
			"mailerSetType": "Renewal",
			"mailerSetStatus": "Open",
			"mailerSetPrefix": "LIC_EXPIRATION_FINAL_NOTICE",
			"updateExpirationStatus": "Expired",
			"updateRecordStatus": "Expired",
			"updateWorkflowTask": "License Status",
			"updateWorkflowStatus": "Expired",
			"nextNotificationDays": -60,
			"nextNotification": "60 Day Expired"
		
		},
		"60 Day Expired": {  
			"notificationTemplate": "SS_LIC_EXPIRATION_FINAL_NOTICE",
			"notificationReport": false,
			"notifyContactTypes": "Authorized Agent, Business Entity",
			"mailerSetType": false,
			"mailerSetStatus":false,
			"mailerSetPrefix": true,
			"updateExpirationStatus": false,
			"updateRecordStatus": "Closed",
			"updateWorkflowTask": false,
			"updateWorkflowStatus": false,
			"nextNotificationDays": false,
			"nextNotification": "",
			"inspectionType": false,
			"scheduleOutDays": false
		}
	}
}