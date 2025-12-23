import * as express from "express";
import CouponController from "admin/controllers/coupons/controller";
import { validateCouponBody, validateListCouponQuery } from "admin/controllers/coupons/validation";

const router = express.Router();

const {
  addCoupon,
  getCoupons,
  getCoupon,
  editCoupon,
  deleteCoupon
} = CouponController;

router.post("/add", validateCouponBody, addCoupon);
router.get("/list", validateListCouponQuery, getCoupons);
router.get("/get/:id", getCoupon);
router.post("/edit/:id", validateCouponBody, editCoupon);
router.delete("/delete", deleteCoupon);

export default router;
