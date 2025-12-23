import * as express from "express";
import PlanController from "admin/controllers/plans/controller";
import { validatePlanBody, validateListPlanQuery } from "admin/controllers/plans/validation";

const router = express.Router();

const {
  addPlan,
  getPlans,
  getPlan,
  editPlan,
  deletePlan,
} = PlanController;

router.get("/list/:courseid", validateListPlanQuery, getPlans);
router.get("/get/:id", getPlan);
router.post("/add", validatePlanBody, addPlan);
router.post("/edit/:id", validatePlanBody, editPlan);
router.delete("/delete", deletePlan);

export default router;
