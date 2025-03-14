
const inputToken = document.getElementById('tokenInput');
const form = document.getElementById("form");
const message = document.getElementById("message");
const chats = document.getElementById("chats");
const userList = document.getElementById("users");

let socket;
let roomName = "";

const joinRoom = (room) => {
    roomName = room;
    console.log(`Joining the: ${roomName}`);
    socket.emit("joinRoom", roomName);
};

function initializeSocket(token) {
    socket = io("/chat", {
        auth: {
            token: token
        },
    });

    console.log("Token sent: " + token);

    socket.on('connect', () => {
        console.log('Connection established with the server');
        socket.emit('sendToken', token);
    });

    socket.on('tokenReceived', (message) => {
        console.log(message);
    });

    socket.on('error', (errMsg) => {
        console.error('Error:', errMsg);
    });

    socket.on("users", (users) => {
        console.log(users);
        userList.innerHTML = "";
        users.forEach(({ name }) => {
            const item = document.createElement("li");
            item.textContent = name;
            userList.appendChild(item);
        });
    });

    joinRoom(roomName);

    socket.on("message", (data) => {
        console.log(data);
        const li = document.createElement("li");
        li.textContent = data;
        chats.appendChild(li);
    });

    socket.on('userDisconnected', (userName) => {
        console.log(userName);
        const li = document.createElement('li'); 
        li.textContent = userName;
        li.style.color = 'red'; 
        chats.appendChild(li); 
    });
}

document.getElementById("sendTokenButton").addEventListener("click", () => {
    const token = inputToken.value;
    if (token) {
        initializeSocket(token);
        console.log("socket initialized with the token " + token);
    } else {
        console.error("Please enter a valid token.");
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (socket) {
        socket.emit("message", message.value);
        message.value = "";
    } else {
        console.error("Socket is not initialized.");
    }
});


