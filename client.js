const socket = io("http://localhost:4000"); // Ensure the correct server URL

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

const name = prompt('Enter your name to join the chat');

var audio = new Audio('chat.mp3');

// Function to append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div'); // Create a new div dynamically
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);
    
    if (position === 'left') {
        audio.play();
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right'); // Added 'right' as position
    socket.emit('send', message);
    messageInput.value = '';
});

socket.emit("new-user-joined", name);

socket.on('user-joined', (userName) => {
    append(`${userName} joined the chat`, 'right'); // Corrected variable name
});

socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left'); // Fixed 'receive' spelling
});

socket.on('left', (userName) => {
    append(`${userName} left the chat`, 'left'); // Fixed variable reference
});
