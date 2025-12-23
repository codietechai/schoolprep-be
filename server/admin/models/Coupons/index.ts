import { Coupon as CouponModel } from "database/schema"; // Path to your Coupon model (ensure it's a Mongoose model)
import { TListFilters, TAddCoupon, TEditCoupon } from "admin/controllers/coupons/types"; // Import correct types

export class Coupon {
    constructor() { }

    /**
     * Get the list of coupons with filtering, sorting, and pagination
     * @param filters 
     * @returns 
     */
    public async getCoupons(filters: TListFilters) {
        const where: any = {};

        // Search filter for name or code
        if (filters.search) {
            where.$or = [
                { code: { $regex: filters.search, $options: 'i' } }
            ];
        }

        const total = await CouponModel.countDocuments(where); // countDocuments for MongoDB
        const data = await CouponModel.find(where)
            .skip(filters.offset)  // pagination: skip the first 'offset' documents
            .limit(filters.limit)  // pagination: limit the results to 'limit'

        return { total, data };
    }

    /**
     * Add a new coupon
     * @param data 
     * @returns 
     */
    public async addCoupon(data: TAddCoupon): Promise<any> {
        const newCoupon = await CouponModel.create(data); // MongoDB way to create a new document
        return newCoupon;
    }

    /**
     * Get a coupon by its unique code
     * @param code 
     * @returns 
     */
    public async getCouponByCode(code: string): Promise<any> {
        const coupon = await CouponModel.findOne({
            code,
        }); // MongoDB way to find a single document by a field
        return coupon;
    }

    /**
     * Get a coupon by its ID
     * @param id 
     * @returns 
     */
    public async getCouponById(id: string): Promise<any> {
        const coupon = await CouponModel.findById(id); // MongoDB method to find by ID
        return coupon ? coupon : null;
    }

    /**
     * Edit an existing coupon by its ID
     * @param id 
     * @param data 
     * @returns 
     */
    public async editCoupon(id: string, data: TEditCoupon): Promise<any> {
        const coupon = await CouponModel.findById(id);
        if (!coupon) return null;

        await coupon.updateOne(data); // MongoDB method to update a document
        return coupon;
    }

    /**
     * Delete coupons by a list of coupon IDs
     * @param ids 
     * @returns 
     */
    public async deleteCoupons(ids: number[]): Promise<number> {
        const response = await CouponModel.deleteMany({
            _id: { $in: ids }, // MongoDB way to find documents by multiple IDs
        });
        return response.deletedCount; // MongoDB returns deletedCount instead of number of rows
    }
}
