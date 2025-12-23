const { OrderItem } = require("sequelize");

// TListFilters.ts
export interface TListFilters {
  offset: number;            // Offset for pagination
  limit: number;             // Limit for pagination
  search: string;            // Search term for filtering coupons (e.g., by `code`)
  sorting: string;           // Sorting criteria (e.g., 'createdAt DESC')
}

// TAddCoupon.ts
export interface TAddCoupon {
  code: string;              // The unique coupon code
  discount_percentage: number; // Discount percentage of the coupon
  valid_from: Date;          // The start date of coupon validity
  valid_until: Date;         // The end date of coupon validity
  active?: boolean;          // Flag to determine if the coupon is active (default is true)
}

// TEditCoupon.ts
export interface TEditCoupon {
  code?: string;             // The unique coupon code (optional if not updating)
  discount_percentage?: number; // Discount percentage of the coupon (optional if not updating)
  valid_from?: Date;         // The start date of coupon validity (optional if not updating)
  valid_until?: Date;        // The end date of coupon validity (optional if not updating)
  active?: boolean;          // Flag to determine if the coupon is active (optional if not updating)
}
