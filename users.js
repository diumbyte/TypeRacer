// In-memory story for now. Refactor to DB later.
const users = [];

const addUser = (id, room, name) => {
    // const existingUser = users.find(
    //     user => user.room === room && user.name === name
    // );

    if (!name || !room) return { error: "Username and room values are required."}
    // if (existingUser) return { error: "Username is taken."}

    const user = {
        id,
        room,
        name,
        typingComplete: false,
        currentIndex: 0,
        // startTime: 0,
        // elapsedTime: 0
    };

    users.push(user);
    return { 
        id, 
        name: user.name, 
        typingComplete: user.typingComplete,
        currentIndex: user.currentIndex,
        // elapsedTime: user.elapsedTime
    }
}

const removeUser = (id) => {
    const idx = users.findIndex(user => user.id === id);

    if (idx !== -1) {
        return users.splice(idx,1)[0];
    }
}

const updateUserTypingStatus = (id) => {
    const userIdx = users.findIndex(u => u.id === id);
    if (userIdx === -1) return;

    users[userIdx].typingComplete = true;
}

const checkIfAllUsersCompletedText = (room) => {
    return users.filter(u => u.room === room).every(u => u.typingComplete);
}

const resetUsersStatuses = (roomId) => {
    users.filter(u => u.room === roomId).forEach(u => u.typingComplete = false);
}

const getUser = (id) => users.find(user => user.id === id);

const updateUserCurrentIndex = (id, currentIndex) => {
    const userIdx = users.findIndex(u => u.id === id);
    if (userIdx === -1) return;

    users[userIdx].currentIndex = currentIndex;
}

const getUsersInRoom = (room) => users.filter(user => user.room === room);

const checkNoMoreUsersInRoom = (roomId) => users.filter(u => u.room === roomId).length === 0;

const updateUsersStartTime = (roomId) => {
    const currentTime = new Date() * 1;

    users.filter(u => u.roomId === roomId).forEach(u => {
        u.elapsedTime = 0;
        u.startTime = currentTime;
    });
}

const setUserElapsedTime = (userId) => {
    const userIdx = users.findIndex(u => u.id === userId);
    if(userIdx === -1) return;

    const currentTime = new Date() * 1;

    users[userIdx].elapsedTime = currentTime - users[userIdx].startTime;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    checkIfAllUsersCompletedText,
    updateUserTypingStatus,
    resetUsersStatuses,
    updateUserCurrentIndex,
    checkNoMoreUsersInRoom,
    updateUsersStartTime,
    setUserElapsedTime
}