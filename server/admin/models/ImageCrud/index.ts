import * as admin from "firebase-admin";
import { ERROR_MESSAGE } from "admin/constants";

export class ImageCrud {
    private bucket: any;

    constructor() {
        this.bucket = admin
            .storage()
            .bucket("gs://test-storage-7acfd.appspot.com");
    }
    async uploadImage(imageData: Buffer, fileName: string) {
        try {
            const file = this.bucket.file(fileName);
            const writeStream = file.createWriteStream({
                metadata: {
                    contentType: "image/jpeg",
                },
            });

            return new Promise<string>((resolve, reject) => {
                writeStream.on("error", reject);
                writeStream.on("finish", async () => {
                    await file.makePublic();
                    const [url] = await file.getSignedUrl({
                        action: "read",
                        expires: "03-09-2491",
                    });
                    const imageUrl = (url as string).split("?")[0];
                    resolve(imageUrl);
                });
                writeStream.end(imageData);
            });
        } catch (err) {
            throw new Error(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadMultipleImages(images: Buffer[], fileName: string) {
        try {
            let fileNames = [];

            for (let i = 0; i < images.length; i++) {
                const file = this.bucket.file(`${fileName}-${i}`);
                const writeStream = file.createWriteStream({
                    metadata: {
                        contentType: "image/jpeg",
                    },
                });

                await new Promise<string>((resolve, reject) => {
                    writeStream.on("error", reject);
                    writeStream.on("finish", async () => {
                        await file.makePublic();
                        const [url] = await file.getSignedUrl({
                            action: "read",
                            expires: "03-09-2491",
                        });
                        const imageUrl = (url as string).split("?")[0];
                        fileNames.push(imageUrl);
                        resolve(imageUrl);
                    });
                    writeStream.end(images[i]);
                });
            }
            return fileNames;
        } catch (err) {
            throw new Error(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }

    async updateImage(
        oldFileName: string,
        imageData: Buffer,
        newFileName: string
    ) {
        try {
            const oldfile = this.bucket.file(oldFileName);
            await oldfile.delete();

            const file = this.bucket.file(newFileName);
            const writeStream = file.createWriteStream({
                metadata: {
                    contentType: "image/jpeg",
                },
            });

            return new Promise<string>((resolve, reject) => {
                writeStream.on("error", reject);
                writeStream.on("finish", async () => {
                    await file.makePublic();
                    const [url] = await file.getSignedUrl({
                        action: "read",
                        expires: "03-09-2491",
                    });
                    resolve(url);
                });
                writeStream.end(imageData);
            });
        } catch (err) {
            throw new Error(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }

    async getImage(fileName: string) {
        const file = this.bucket.file(fileName);
        const [exists] = await file.exists();
        if (!exists) {
            throw new Error("Image not found");
        }
        const [url] = await file.getSignedUrl({
            action: "read",
            expires: "03-09-2491",
        });
        return url;
    }

    async deleteImage(fileName: string) {
        const file = this.bucket.file(fileName);
        await file.delete();
        return true;
    }
}
