import 'dotenv/config'
import express from "express";
// import { pool } from "./config/database";
import userRoute from "./routes/user.route";
import authRoute from "./routes/auth.route"
import { httpErrorHandle } from "./middlewares/httpErrorHandle.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import rateLimit from "express-rate-limit";
import petRoute from "./routes/pet.route"

import openapiSpecification from "./config/swagger";
import swaggerUI from "swagger-ui-express";

import { sequelize } from './config/database';
import morgan from 'morgan';
import http from 'node:http';
// import { verifyAccessToken } from './utils/auth.util';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';


const app = express()
const port = process.env.PORT || 3000;

app.use('/api/v1/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification))

app.use(express.json())
app.use(morgan('dev'));

// ********************************************************************************
const handleError = (socket: Socket, event: string, error: Error) => {
    console.log(`Error in event ${event}: ${error.message}`);
    socket.emit("error", {
        event,
        message: "An error occurred",
    });
};

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const chat = io.of("/chat");

declare module "socket.io" {
    interface Socket {
        userName?: string;
        user?: string;

    }
}

interface User {
    id: string;
    name: string;    
    joinedAt?: Date;
}
interface DecodedToken {
    email: string;
    uid: string;
    name: string;

}


chat.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        console.log("No token provided");
        return next(new Error("Authentication error"));
    }

    try {
        const decodedToken = jwt.verify(token, "secret") as DecodedToken;
        console.log("Decoded Token: ", decodedToken);
        const { name } = decodedToken;
        console.log("userData: ", name);
        socket.userName = name;
        next();
    } catch (error) {
        console.log(error);
        next(new Error("Authentication error"));
    }
});

const connectedUsers: { [key: string]: User } = {};

chat.on('connect', (socket) => {
    console.log('connected customer', socket.userName);

    socket.on('joinRoom', (room) => {
        console.log('room', room);
        socket.join(room);

        const user = connectedUsers[socket.id];

        if (!user) {
            handleError(socket, 'joinRoom', new Error('User not found'));
            return;
        }

        chat.to(room).emit('message', `The  ${socket.userName} has entered ${room}`);
    });

    socket.on('sendToken', (token) => {
        console.log('Token received from the client', { name: socket.userName, token });
    });

    const userName = socket.userName as string;
    connectedUsers[socket.id] = {
        id: socket.id,
        name: userName,
        joinedAt: new Date(),
    };

    chat.emit('users', Object.values(connectedUsers));

    socket.emit('message', `Welcome to the chat:  ${socket.userName}`);

    socket.on("message", (message) => {
        console.log(message);
        chat.emit('message', `${socket.userName}: ` + message);
    });

    socket.on('disconnect', () => {
        const userName = socket.userName as string;
        delete connectedUsers[socket.id];
        chat.emit('users', Object.values(connectedUsers));
        chat.emit('userDisconnected', `${userName} has been disconnected `);
    });

});
// *****************************************************************************


app.use(express.urlencoded({ extended: true }));

// configurador limitador
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
        "Too many requests from this IP, please try later.",
    standardHeaders: true,
    legacyHeaders: false,
});

// aplicando limitador globalmente
app.use(limiter);

app.use(loggerMiddleware)

app.use("/api/v1/users", userRoute)

app.use("/api/v1/auth", authRoute)

app.use("/api/v1/pets", petRoute)

app.use(httpErrorHandle)

const main = async () => {

    try {


        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Database connected")
        server.listen(port, () => {
            console.log("server running on port:" + port)
        })
    } catch (error) {
        console.log(error)
    }
}

main()




