import { Contact } from "admin/models";

export default class ContactService {
    static async getAllContacts() {
        const obj = new Contact();
        const response = await obj.getAllContacts();
        return response;
    }

    static async getContactById(id: string) {
        const obj = new Contact();
        const response = await obj.getContactById(id);
        return response;
    }

    static async deleteContacts(ids: string[]) {
        const obj = new Contact();
        const response = await obj.deleteContacts(ids);
        return response;
    }

    static async getByName(name: string) {
        const obj = new Contact();
        const response = await obj.getByName(name);
        return response;
    }
}
