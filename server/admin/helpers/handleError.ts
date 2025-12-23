import { RESPONSE_TYPE } from "admin/constants";

export const sendResponse = (type: string, message: string, data?: any) => {
    return {
        success: type === RESPONSE_TYPE.SUCCESS,
        message: message,
        data: data ?? null,
    };
};

export const createUserResponse = (user: any) => {
    let userDetails = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        contact_number: user.contact_number,
        phone_code: user.phone_code,
        role: user.role,
        profile_photo: user.profile_photo,
        address: user.address,
        last_login_at: user.last_login_at,
        plan_id:user.plan_id,
        is_user_subscribed:user.is_user_subscribed,
        created_at: user.createdAt,
    };
    return userDetails;
};
