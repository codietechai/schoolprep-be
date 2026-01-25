import * as express from "express";

import {
    validateContactBody,
} from "../controllers/contact/validation";
import ContactController from "../controllers/contact/controller";

const router = express.Router();

const {
    addContact,
} = ContactController;

router.post("/", validateContactBody, addContact);

export default router;
