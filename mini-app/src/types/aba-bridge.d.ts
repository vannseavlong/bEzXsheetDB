type GetProfile = {
  appId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  sex: string;
  dobShort: string;
  nationality: string;
  phone: string;
  email: string;
  lang: string;
  id: string;
  appVersion: string;
  osVersion: string;
  address: string;
  city: string;
  country: string;
  dobFull: string;
  nidNumber: string;
  nidType: string;
  nidExpiryDate: string;
  nidDoc: string;
  occupation: string;
  addrCode: string;
  secret_key: string;
};

type DoPayment = {
  amount: string;
  account: string;
  currency: string;
  useDefault: boolean;
  additionalKey: AdditionalKey;
};

interface AdditionalKey {
  hash: string;
}

type GetDefaultAcc = {
  accountName: string;
  accountNumber: string;
  currency: string;
};

type GetStatus = {
  transactionId: string;
  debitAmount: string;
  debitCcy: string;
  accountNumber: string;
  accountName: string;
};

export { GetProfile, DoPayment, GetDefaultAcc, GetStatus };
