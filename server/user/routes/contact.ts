import * as express from "express";
import ContactController from "user/controllers/contact/controller";
import {
    validateContactBody,
} from "user/controllers/contact/validation";

const router = express.Router();

const {
    addContact,
} = ContactController;

router.post("/", validateContactBody, addContact);

export default router;
