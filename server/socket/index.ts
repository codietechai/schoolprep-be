import { Server } from "socket.io";
import http from "http";
import app from "../index";
import TestService from "admin/controllers/Test/service";
import { Test } from "server/database/schema/Test";
import mongoose from "mongoose";
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.SOCKET_URL,
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {};

export const getRecieverSocketId = (receiverId: string) => {
    return userSocketMap[receiverId];
};

io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    const testId = socket.handshake.query.testId;

    await Test.findOneAndUpdate(
        {
            user_id: new mongoose.Types.ObjectId(userId as string),
            status: "PAUSED",
            _id: new mongoose.Types.ObjectId(testId as string),
            type: "PREPARATORY",
        },
        {
            status: "ACTIVE",
            unpaused_at: new Date(),
        }
    );

    if (userId !== "undefined") {
        userSocketMap[userId as string] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", async () => {
        delete userSocketMap[userId as string];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        await Test.findOneAndUpdate(
            {
                user_id: new mongoose.Types.ObjectId(userId as string),
                status: "ACTIVE",
                _id: new mongoose.Types.ObjectId(testId as string),
                type: "PREPARATORY",
            },
            {
                status: "PAUSED",
                paused_at: new Date(),
            }
        );

        // const isTestAlreadySubmitted = await Test.findOne({
        //     _id: new mongoose.Types.ObjectId(testId as string),
        //     status: "SUBMITTED",
        // });
        // if (isTestAlreadySubmitted === null) {
        //     await TestService.submitTest({
        //         test_id: testId as string,
        //         user_id: userId as string,
        //     });
        // }
    });
});

export { io, server };
