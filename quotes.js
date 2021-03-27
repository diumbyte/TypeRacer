const axios = require('axios').default;
const quotes = [];
const QUOTABLE_API_URL = "https://api.quotable.io/random";

const setQuote = async (room) => {
    const existingQuoteForRoom = quotes.findIndex(q => q.room === room);
    const res = await axios.get(`${QUOTABLE_API_URL}?minLength=70`);

    const quotePayload = {
        room,
        gameInProgress: true,
        content: res.data.content
    }

    if(existingQuoteForRoom === -1) {
        quotes.push(quotePayload);
    } else {
        quotes[existingQuoteForRoom] = quotePayload;
    }

    return quotePayload;
}

const getQuoteInRoom = (room) => quotes.find(q => q.room === room);

const resetRoomStatuses = (room) => {
    const roomIdx = quotes.findIndex(q => q.roomId === room);
    if(roomIdx === -1) return;
    
    quotes[roomIdx].gameInProgress = false;
    quotes[roomIdx].content = "";
    quotes[roomIdx].room = room;
};

const getRoomStatus = (room) =>  quotes.find(q => q.room === room).gameInProgress;

const deleteRoom = (roomId) => {
    quotes.splice(quotes.indexOf(q => q.room === roomId), 1);
}

module.exports = {
    setQuote,
    getQuoteInRoom,
    resetRoomStatuses,
    getRoomStatus,
    deleteRoom
}