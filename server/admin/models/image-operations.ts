import * as admin from "firebase-admin";

const bucket = admin.storage().bucket();

export const uploadImage = async (imageData: Buffer, fileName: string) => {
    const file = bucket.file(fileName);
    const writeStream = file.createWriteStream({
        metadata: {
            contentType: "image/jpeg",
        },
    });

    return new Promise((resolve, reject) => {
        writeStream.on("error", reject);
        writeStream.on("finish", () => {
            file.makePublic().then(resolve);
        });
        writeStream.end(imageData);
    });
};

export const getImage = async (fileName: string) => {
    const file = bucket.file(fileName);
    const [exists] = await file.exists();
    if (!exists) {
        throw new Error("Image not found");
    }
    const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
    });
    return url;
};

export const deleteImage = async (fileName: string) => {
    const file = bucket.file(fileName);
    await file.delete();
};

export const updateImage = async (
    oldFileName: string,
    imageData: Buffer,
    newFileName: string
) => {
    await deleteImage(oldFileName);
    await uploadImage(imageData, newFileName);
};
