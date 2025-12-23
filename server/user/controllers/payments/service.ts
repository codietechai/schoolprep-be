import {
    TContact,
} from "common/types/contact";
import { Contact } from "../../models";

export default class ContactService {
    static async addContact(data: TContact) {
        const obj = new Contact();
        const response = await obj.addContact(data);
        return response;
    }}
