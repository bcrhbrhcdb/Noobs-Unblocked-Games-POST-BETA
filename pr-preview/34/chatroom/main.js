document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messagesContainer");
    const messageInput = document.getElementById("messageInput");
    const nameInput = document.getElementById("nameInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const setNameBtn = document.getElementById("setNameBtn");
    const pingSound = document.getElementById("pingSound");

    let userName = localStorage.getItem(`userName`) || "";

    // Initialize Pusher
    const pusher = new Pusher('0b026fc2c65a65e40b1a', {
        cluster: 'us2',
        encrypted: true
    });

    const channel = pusher.subscribe('chat');

    // Bind to receive messages
    channel.bind('client-message', function(data) {
        displayMessage(data);
        if (data.name !== userName) {
            pingSound.play();
        }
    });

    // Display welcome message if username exists
    if (userName) {
        displayWelcomeMessage(userName);
        setNameBtn.textContent = "Change Name";
        
        // Send a message indicating the user has joined
        sendPusherMessage({ name: "System", message: `${userName} has joined the chat` });
    }

    setNameBtn.addEventListener("click", () => {
        const newUserName = nameInput.value.trim();
        
        if (/^[a-zA-Z0-9]+$/.test(newUserName) && newUserName !== "") {
            if (userName) {
                displayMessage({ 
                    name: "System", 
                    message: `${userName} changed their name to ${newUserName}`, 
                    timestamp: new Date().toLocaleTimeString() 
                });
            }
            
            userName = newUserName;
            localStorage.setItem(`userName`, userName);
            displayWelcomeMessage(userName);
            sendPusherMessage({ name: "System", message: `${userName} has joined the chat` });
        } else {
            alert("Username must not contain spaces or special characters and cannot be empty.");
        }
    });

    sendMessageBtn.addEventListener("click", sendMessage);
    
    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        
        if (message) {
            const displayName = userName || "Anonymous";
            const timestamp = new Date().toLocaleTimeString();
            const messageObject = { name: displayName, message, timestamp };

            // Send message to Pusher
            sendPusherMessage(messageObject);
            messageInput.value = '';
        } else {
            alert("Please enter a message.");
        }
    }

    function sendPusherMessage(messageObject) {
        // Trigger the Pusher event with 'client-' prefix
        channel.trigger('client-message', messageObject);
    }

    function displayWelcomeMessage(name) {
        const welcomeMessage = document.createElement("div");
        welcomeMessage.classList.add("message");
        welcomeMessage.innerHTML = `<span>${name}</span> has joined the chat!`;
        messagesContainer.appendChild(welcomeMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function displayMessage({ name, message, timestamp }) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.innerHTML = `<span>${name}</span>: ${message} <time>${timestamp}</time>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});