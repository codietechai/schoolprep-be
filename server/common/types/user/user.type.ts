export type TUser = {
    id?: number;
    password?: string;
    email?: string;
    full_name?: string;
    role?: string;
    contact_number?: string;
    country_code?: string;
    phone_code?: string;
    status?: string;
    registration_date?: Date;
    profile_photo?: string;
    address?: string;
    profile_photo_data?: Buffer;
    emailSignal?: number;
    browserSignal?: number;
    appSignal?: number;
    smsSignal?: number;
    last_login_at?: Date;
    last_login_ip?: string;
    onboarding_step?: string;
    email_code?: string;
    email_code_expiry?: Date;
    email_verified?: boolean;
    phone_verified?: boolean;
    billing_name?: string;
    billing_country?: string;
    billing_state?: string;
    billing_city?: string;
    billing_street?: string;
    billing_zip?: string;
    billing_tax_number?: string;
    browser_id?: string;
    timezone?: string;
    token_status?: string;
    createdAt?: Date;
    is_agreed?: boolean;
    is_user_subscribed?:boolean,
    plan_id?:boolean,
};

export type TUserToken = {
    id: number;
    refresh_token: string;
    last_login_at: Date;
    last_login_ip: string;
};

export type TSignupUserToken = {
    email: string;
    password: string;
    last_login_at: Date;
    last_login_ip: string;
};

export type TUpdateUserPassword = {
    id: string;
    password: string;
};

export type TUsersList = {
    total: number;
    data: TUser[];
};

export type TSendVerificationCode = {
    user_id: number;
    code: number;
    email: string;
};

export type TUpdateUser =
    | {
          full_name: string;
          country_code: string;
          image: string;
      }
    | {
          phone_code: string;
          contact_number: string;
      }
    | {
          profile_photo: string;
      }
    | { full_name: string; country_code: string }
    | { email: string }
    | { onboarding_step: string }
    | {
          billing_name: string;
          billing_country: string;
          billing_state: string;
          billing_city: string;
          billing_street: string;
          billing_zip: string;
          billing_tax_number: string;
      };

export type TSendPhoneVerificationCode = {
    user_id: number;
    code: number;
    phone: string;
};

export type TVerifyEmailPayload = {
    email_code: null;
    email_code_expiry: null;
    email_verified: 1;
    onboarding_step?: string;
};

export type TForgotPassword = {
    password_reset_code: number;
    password_reset_expiry: Date;
    id: number;
};

export type TResetPassword = {
    password: string;
    id: number;
};

export type TLogActivity = {
    id?: number;
    activity: string;
    message: string;
    rel: string;
    rel_id: string;
    user_id: string;
    icon?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TLogsList = {
    total: number;
    data: TLogActivity;
};
