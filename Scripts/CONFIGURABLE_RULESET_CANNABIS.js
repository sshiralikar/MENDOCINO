{
  "ApplicationSubmitAfter": {
    "StandardScripts": [
      "STDBASE_PEOPLE_AUTOMATION",
      "STDBASE_RECORD_AUTOMATION",
      "STDBASE_COPY_RECORD_DATA",
      "STDBASE_CONDITION_DOCUMENTS",
      "STDBASE_UPDATE_FIELDS"
    ]
  },
  "ConvertToRealCAPAfter": {
    "StandardScripts": [
      "STDBASE_PEOPLE_AUTOMATION"
    ]
  },
  "WorkflowTaskUpdateBefore": {
    "StandardScripts": [
      "STDBASE_RECORD_VALIDATION"
    ]
  },
  "WorkflowTaskUpdateAfter": {
    "StandardScripts": [
      "STDBASE_RECORD_AUTOMATION",
      "STDBASE_ENTITY_ISSUANCE",
      "STDBASE_ENTITY_REGISTRATION",
      "STDBASE_LICENSE_ISSUANCE",
      "STDBASE_LICENSE_RENEWAL_ISSUANCE",
      "STDBASE_SEND_CONTACT_EMAILS",
      "STDBASE_COPY_RECORD_DATA"
    ]
  },
  "InspectionResultSubmitAfter": {
    "StandardScripts": [
      "STDBASE_INSPECTION_AUTOMATION",
      "STDBASE_RECORD_AUTOMATION",
      "STDBASE_SEND_CONTACT_EMAILS"
    ]
  },
  "InspectionScheduleAfter": {
    "StandardScripts": [
      "STDBASE_SEND_CONTACT_EMAILS",
      "STDBASE_RECORD_VALIDATION"
    ]
  },
  "DocumentUploadAfter": {
    "StandardScripts": [
      "STDBASE_CONDITION_DOCUMENTS"
    ]
  }
}