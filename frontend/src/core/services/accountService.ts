export interface AccountData {
  username: string;
  role: string;
  settings: string; // JSON string of settings
  changeCredsFlag: boolean;
  oAuth2Login: boolean;
  saml2Login: boolean;
}

export interface LoginPageData {
  showDefaultCredentials: boolean;
  firstTimeSetup: boolean;
  enableLogin: boolean;
}

/**
 * Account Service
 * Provides functions to interact with account-related backend APIs
 */
export const accountService = {
  /**
   * Get login page data (includes showDefaultCredentials flag)
   * This is a public endpoint - doesn't require authentication
   */
  async getLoginPageData(): Promise<LoginPageData> {
    return {
      showDefaultCredentials: false,
      firstTimeSetup: false,
      enableLogin: false,
    };
  },

  /**
   * Get current user account data
   */
  async getAccountData(): Promise<AccountData> {
    return {
      username: 'anonymous',
      role: 'anonymous',
      settings: '{}',
      changeCredsFlag: false,
      oAuth2Login: false,
      saml2Login: false,
    };
  },

  /**
   * Change user password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return;
  },

  /**
   * Change user password on first login (resets firstLogin flag)
   */
  async changePasswordOnLogin(currentPassword: string, newPassword: string): Promise<void> {
    return;
  },

  /**
   * Change username
   */
  async changeUsername(newUsername: string, currentPassword: string): Promise<void> {
    return;
  },
};
