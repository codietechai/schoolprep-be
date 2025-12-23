export type TAdmin = {
    id: number;
    email: string;
    password: string;
    full_name: string;
    contact_number: string;
    phone_code: string;
    role: number;
    profile_photo: string;
    address: string;
    last_login_at: Date;
    last_login_ip: string;
    refresh_token: string;
    createdAt: Date;
    updatedAt: Date;
};

export type TUpdateAdminToken = {
    user_id: number;
    refresh_token: string;
    last_login_at: Date;
    last_login_ip: string;
    token_status: string;
};

export type TUpdateAdminProfile = {
    user_id: string;
    full_name: string;
    contact_number: string;
    phone_code: number;
    address: string;
};

export type TUpdateAdminPassword = {
    user_id: string;
    password: string;
};

export type TSendVerificationCode = {
    user_id: number;
    code: number;
    email: string;
    full_name: string;
};

export type TForgotPassword = {
    password_reset_code: string;
    password_reset_expiry: Date;
    id: number;
};

export type TResetPassword = {
    password: string;
    id: number;
};
