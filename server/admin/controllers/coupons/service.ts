import { Coupon } from "admin/models/Coupons"; // Make sure the model path is correct
import { TListFilters, TAddCoupon, TEditCoupon } from "admin/controllers/coupons/types"; // Define your types correctly

export default class CouponService {
    /**
     * Get the list of coupons with filtering, sorting, and pagination
     * @param data 
     * @returns 
     */
    static async getCoupons(data: TListFilters) {
        const obj = new Coupon();
        const response = await obj.getCoupons(data);
        return response;
    }

    /**
     * Add a new coupon to the system
     * @param data 
     * @returns 
     */
    static async addCoupon(data: TAddCoupon) {
        const obj = new Coupon();
        const response = await obj.addCoupon(data);
        return response;
    }

    /**
     * Get a coupon by its unique code
     * @param code 
     * @returns 
     */
    static async getCouponByCode(code: string) {
        const obj = new Coupon();
        const response = await obj.getCouponByCode(code);
        return response;
    }

    /**
     * Get a coupon by its ID
     * @param id 
     * @returns 
     */
    static async getCouponById(id: string) {
        const obj = new Coupon();
        const response = await obj.getCouponById(id);
        return response;
    }

    /**
     * Edit an existing coupon by its ID
     * @param id 
     * @param data 
     * @returns 
     */
    static async editCoupon(id: string, data: TEditCoupon) {
        const obj = new Coupon();
        const response = await obj.editCoupon(id, data);
        return response;
    }

    /**
     * Delete coupons by a list of coupon IDs
     * @param ids 
     * @returns 
     */
    static async deleteCoupons(ids: number[]) {
        const obj = new Coupon();
        const response = await obj.deleteCoupons(ids);
        return response;
    }
}
