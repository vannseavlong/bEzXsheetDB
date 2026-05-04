// button-utils.ts

import moment from 'moment';

/**
 * Determines if a button should be disabled.
 * @param condition - boolean condition to check
 * @returns boolean
 */
export const isButtonDisabled = (condition: boolean): boolean => {
  return condition;
};

export const CONSTANTS = {
  LIMIT_PER_PAGE: 15
};

export const TEMP_HIDE = true;

export const initialDateRange = {
  // previous 3 months
  from: moment().subtract(3, 'M').startOf('M').toDate(),
  to: moment().toDate()
};

export const PageUrlTypes = {
  bookingScreen: 'BOOKING-SCREEN',
  topupHistoryScreen: 'TOPUP-HISTORY-SCREEN',
  bundleHistoryScreen: 'BUNDLE-HISTORY-SCREEN',
  orderRating: 'ORDER-RATING',
  browser: 'BROWSER',
  checkoutScreen: 'CHECKOUT-SCREEN',
  announcementDetailScreen: 'ANNOUNCEMENT-DETAIL-SCREEN',
  orderDetailScreen: 'ORDER-DETAIL-SCREEN',
  bComboScreen: 'B-COMBO-SCREEN',
  bannerScreen: 'BANNER-SCREEN'
};

export const buttonConfig: {
  [key: string]: { text: string; variant: 'default' | 'destructive' | 'outline' | 'success' };
} = {
  PENDING: {
    text: 'Confirm Order',
    variant: 'default'
  },
  ACCEPTED: {
    text: 'Completed Order',
    variant: 'success'
  },
  IN_PROGRESS: {
    text: 'Complete Order',
    variant: 'success'
  }
  // COMPLETED: {
  //   text: 'Order Completed',
  //   variant: 'outline'
  // },
  // CANCELLED: {
  //   text: 'Order Cancelled',
  //   variant: 'destructive'
  // }
};

export const ScheduleType = {
  now: 'NOW',
  schedule: 'SCHEDULED',
  recurring: 'RECURRING',
  event: 'EVENT_TRIGGERED'
};

export const AnnouncementType = {
  general: 'GENERAL',
  packageDeal: 'PACKAGE_DEAL'
};

export const UserType = {
  user_type_all: 'user_type_all',
  user_type_guest: 'user_type_guest',
  user_type_user: 'user_type_user',
  user_type_customer: 'user_type_customer'
};

export const OverviewDescription = {
  totalUserRegistered: 'Total number of registered users',
  totalNewUserRegistered: 'Total number of new users registered',
  totalReturnCustomerRate: 'Percentage of customers who have made more than one purchase',
  totalAvgOrderRevenue: 'Average revenue generated per order',

  // overview
  usersActiveCount: 'Total number of active users',
  usersInActiveCount: 'Total number of inactive users',
  totalGuestMode: 'Total number of guest mode users',
  totalAccountDeleted: 'Total number of deleted accounts',
  userCount: 'Total number of users',
  orderCount: 'Total number of orders',
  notInterestedCount: 'Total number of not interested users',
  interestedButNotNowCount: 'Total number of interested but not now users',
  noAnswerCount: 'Total number of no answer users',
  existingCustomerCount: 'Total number of existing customers',

  // dashboard
  reach: 'Total number of reach',
  clicks: 'Total number of clicks',
  conversions: 'Total number of conversions',
  appInstalls: 'Total number of app installs',
  totalCost: 'Total cost',
  costPerClick: 'Cost per click',
  costPerConversion: 'Cost per conversion',
  revenue: 'Total revenue',
  roas: 'Return on ad spend',

  // app data
  downloadCount: 'Total number of downloads',
  totalInstallOpen: 'Total number of install and open',
  totalRegisteredUsers: 'Total number of registered users',
  totalActiveUsers: 'Total number of active users',
  totalInactiveUsers: 'Total number of inactive users'
};

export enum GenderEnum {
  male = 'MALE',
  female = 'FEMALE'
}

export const GenderLabels = {
  [GenderEnum.male]: 'Male',
  [GenderEnum.female]: 'Female'
};

export enum CleanerRoleEnum {
  member = 'MEMBER',
  leader = 'LEADER'
}

export const CleanerRoleLabels = {
  [CleanerRoleEnum.member]: 'Member',
  [CleanerRoleEnum.leader]: 'Leader'
};
