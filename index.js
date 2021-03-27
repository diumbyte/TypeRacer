const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const socketEvents = require('./socket/events');
const { setQuote, getQuoteInRoom, getRoomStatus, resetRoomStatuses, deleteRoom, checkRoomExist } = require('./quotes');
const { 
    addUser, 
    removeUser, 
    resetUsersStatuses, 
    getUsersInRoom, 
    checkIfAllUsersCompletedText,
    updateUserTypingStatus,
    updateUserCurrentIndex,
    checkNoMoreUsersInRoom
} = require('./users');
const app = express();

const server = http.createServer(app);
let io;
if(!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    console.log("In dev");
    app.use(cors());
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            // credentials: true
        }
    });
} else {
    io = socketIo(server);
}

const PORT = process.env.PORT || 3001;


io.on("connection", (socket) => {
    console.log(`${socket.id} connected.`);

    /******* Join a room ************/
    const { roomId, name } = socket.handshake.query;
    socket.join(roomId);

    const user = addUser(socket.id, roomId, name);
    io.in(roomId).emit(socketEvents.USER_JOIN_CHAT, user);

    /******* Update Current Index ************/
    socket.on(socketEvents.USER_UPDATE_CURRENT_INDEX, (newCurrentIndex) => {
        const payload = {
            id: socket.id,
            currentIndex: newCurrentIndex
        }
        updateUserCurrentIndex(socket.id, newCurrentIndex);
        io.in(roomId).emit(socketEvents.USER_UPDATE_CURRENT_INDEX, payload);
    })

    /******************* Game Events *********************/
    /******* Game Started ************/
    socket.on(socketEvents.GAME_START, async () => {
        const quotePayload = await setQuote(roomId);
        io.in(roomId).emit(socketEvents.GAME_START, quotePayload);
    });
    /******* User Completed Text ************/
    socket.on(socketEvents.USER_COMPLETED_TEXT, () => {
        updateUserTypingStatus(socket.id);
        io.in(roomId).emit(socketEvents.USER_COMPLETED_TEXT, socket.id);

        /******* Game Ended (All Users Completed Text) ************/
        if(checkIfAllUsersCompletedText(roomId)) {
            io.in(roomId).emit(socketEvents.GAME_END);
            resetUsersStatuses(roomId);
            resetRoomStatuses(roomId);
        }
    });


    /******* Leave a room when socket closed by user ************/
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected.`);
        removeUser(socket.id);
        io.in(roomId).emit(socketEvents.USER_LEAVE_CHAT, user);
        socket.leave(roomId);

        if(checkNoMoreUsersInRoom(roomId)) {
            deleteRoom(roomId);
        }
        
    });
})

app.get("/api/rooms/:roomId/users", (req, res) => {
    const users = getUsersInRoom(req.params.roomId);
    return res.json(users);
});

// TODO: Endpoint to generate random text prompt
app.get("/api/rooms/:roomId", (req, res) => {
    if(!checkRoomExist(req.params.roomId)) {
        return res.json({
            users: [],
            quote: "",
            gameInProgress: false
        })
    }
    
    // users
    const users = getUsersInRoom(req.params.roomId);
    // randomQuote
    let quote = getQuoteInRoom(req.params.roomId) || "";
    // gameInProgress
    let gameInProgress;
    if(!quote) {
        // quote = "";
        gameInProgress = false;
    } else {
        quote = quote.content
        gameInProgress = getRoomStatus(req.params.roomId);
    }

    return res.json({
        users,
        quote,
        gameInProgress
    })
});

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets like our main.js/css file
    app.use(express.static('./client/build'));
    // Express will serve up index.html if it doesn't recognize route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

