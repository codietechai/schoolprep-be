import { Contact as ContactModel } from "server/database/schema";
import {
    TContact,
} from "common/types/contact";

export class Contact {
    public async addContact(payload: TContact): Promise<any> {   
        const data = await ContactModel.create(payload);
        return data;
    }
}
