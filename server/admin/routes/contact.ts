import * as express from "express";
import ContactController from "admin/controllers/contact/controller";
import { validateListQuery } from "admin/controllers/contact/validation";
import { authorize } from "admin/middlewares";

const router = express.Router();

const {
    getContacts,
    getContact,
    deleteContact
} = ContactController;

router.get("/list",authorize('contact',"read"), validateListQuery, getContacts);
router.get("/get/:id",authorize('contact',"read"), getContact);
router.delete("/delete",authorize('contact',"delete"), deleteContact);

export default router;
