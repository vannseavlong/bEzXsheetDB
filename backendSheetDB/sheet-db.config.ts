export default {
  projectName: "backendSheetDB",
  superAdminEmail: "seavlongvann55@gmail.com",
  actors: [
  {
    "role": "admin",
    "sheetIdEnv": "ADMIN_SHEET_ID"
  },
  {
    "role": "operation",
    "sheetIdEnv": "DEV_OPERATION_SHEET_ID"
  },
  {
    "role": "finance",
    "sheetIdEnv": "DEV_FINANCE_SHEET_ID"
  },
  {
    "role": "marketing",
    "sheetIdEnv": "DEV_MARKETING_SHEET_ID"
  },
  {
    "role": "user",
    "sheetIdEnv": "DEV_USER_SHEET_ID"
  }
],
  // Schema mismatch behaviour: 'warn' | 'error' | 'auto-sync'
  onSchemaMismatch: 'warn',
};
