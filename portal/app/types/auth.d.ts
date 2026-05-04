type AdminRoleProps = {
  description: string;
  id: string;
  name: string;
};

type UserResponseProps = {
  userId?: string;
  balance: string;
  createdAt: string;
  email: string;
  firstName: string;
  id: string;
  language: string;
  lastName: string;
  password: string;
  profileUrl: string;
  referralCode: string;
  referrerCode: string;
  status: string;
  type: string;
  updatedAt: string;
  username: string;
};

type LoginResponseProps = {
  token: string;
  userInfo: UserResponseProps;
  permissions: Permission[];
};

interface Permission {
  module: string;
  action: string;
}
