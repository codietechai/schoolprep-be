import { Contact as ContactModel } from "database/schema";
import { TContact } from "common/types/contact";
import { ObjectId } from "mongoose";

export class Contact {
    public async getAllContacts(): Promise<any> {   
        const total = await ContactModel.countDocuments();
        const data = await ContactModel.find();
        return { total, data };
    }

    public async getContactById(id: string | ObjectId): Promise<TContact | null> {
        const data = await ContactModel.findById(id);
        return data ?? null;
    }

    public async deleteContacts(ids: (string | ObjectId)[]): Promise<number> {
        const result = await ContactModel.deleteMany({
            _id: { $in: ids },
        });
        return result.deletedCount ?? 0;
    }

    public async getByName(name: string): Promise<TContact | null> {
        const data = await ContactModel.findOne({ name });
        return data ?? null;
    }
}
