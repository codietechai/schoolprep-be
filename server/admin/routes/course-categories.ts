import * as express from "express";
import CourseCategoryController from "admin/controllers/course-categories/controller";
import { validateCategoryBody, validateListQuery } from "admin/controllers/course-categories/validation";
import { authorize } from "admin/middlewares";

const router = express.Router();

const {
  addCategory,
  getCategories,
  getCategory,
  editCategory,
  deleteCategory
} = CourseCategoryController;

router.get("/list",authorize('course_category',"read"), validateListQuery, getCategories);
router.get("/get/:id",authorize('course_category',"read"), getCategory);
router.post("/add",authorize('course_category',"create"), validateCategoryBody, addCategory);
router.put("/edit/:id",authorize('course_category',"update"), validateCategoryBody, editCategory);
router.delete("/delete",authorize('course_category',"delete"), deleteCategory);

export default router;
