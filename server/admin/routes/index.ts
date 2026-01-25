import * as express from "express";
import authRouter from "./auth";
import permissionsRouter from "./permission";
import rolesRouter from "./roles";
import subjectsRouter from "./subjects";
import courseCategoriesRouter from "./course-categories";
import coursesRouter from "./courses";
import questionsRouter from "./questions";
import couponsRouter from "./coupons";
import plansRouter from "./plan";
// import analyticsReportsRouter from "./analytics-reports";
import userRouter from "./users";
import contactRouter from "./contact";
import topicRouter from "./topic";
import testRouter from "./test";
import dashboardRouter from "./dashboard";
import { auth } from "admin/middlewares/index";

const router = express.Router();

router.use("/", authRouter); // DONE
router.use("/users", auth, userRouter); // DONE
router.use("/permissions", auth, permissionsRouter); // DONE
router.use("/roles", auth, rolesRouter); // DONE
router.use("/subjects", auth, subjectsRouter); // DONE
router.use("/course-categories", auth, courseCategoriesRouter); // DONE
router.use("/courses", auth, coursesRouter); // DONE
router.use("/plans", auth, plansRouter); // DONE
router.use("/questions", auth, questionsRouter); // DONE
router.use("/contact", auth, contactRouter);
router.use("/topic", auth, topicRouter);
router.use("/test", auth, testRouter);
router.use("/dashboard", auth, dashboardRouter);
// router.use("/coupons", auth, couponsRouter);
// router.use("/analytics-reports", auth, analyticsReportsRouter);

export default router;
