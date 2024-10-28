document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messagesContainer");
    const messageInput = document.getElementById("messageInput");
    const nameInput = document.getElementById("nameInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const setNameBtn = document.getElementById("setNameBtn");
    const pingSound = document.getElementById("pingSound");
    const totalMessagesDisplay = document.getElementById("totalMessages");

    let userName = localStorage.getItem(`userName`) || "";
    let totalMessagesToday = JSON.parse(localStorage.getItem('totalMessagesToday')) || 0;

    // Initialize Pusher
    const pusher = new Pusher('0b026fc2c65a65e40b1a', {
        cluster: 'us2',
        encrypted: true,
        authEndpoint: 'YOUR_AUTH_ENDPOINT', // Set your auth endpoint here
        auth: {
            headers: {
                // Add any headers if needed, e.g., for authentication tokens
            }
        }
    });

    // Subscribe to a private channel
    const channel = pusher.subscribe('private-chat');

    // Bind to receive messages
    channel.bind('client-message', function(data) {
        displayMessage(data);
        if (data.name !== userName) {
            pingSound.play();
        }
    });

    // Handle subscription success
    channel.bind('pusher:subscription_succeeded', () => {
        console.log('Successfully subscribed to private-chat');
        
        // Send a message indicating the user has joined
        if (userName) {
            sendPusherMessage({ name: "System", message: `${userName} has joined the chat` });
        }
        
        // Update the total messages display
        updateTotalMessagesDisplay();
    });

    // Handle subscription errors
    channel.bind('pusher:subscription_error', (status) => {
        console.error(`Subscription error: ${status}`);
        alert('Failed to subscribe to the chat. Please try again later.');
    });

    // Display welcome message if username exists
    if (userName) {
        displayWelcomeMessage(userName);
        setNameBtn.textContent = "Change Name";
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

            // Send message to Pusher only if subscribed successfully
            if (channel.subscribed) {
                sendPusherMessage(messageObject);
                storeMessageInLocalStorage(messageObject);
                messageInput.value = '';
            } else {
                alert("You are not subscribed to the chat. Please try again later.");
            }
        } else {
            alert("Please enter a message.");
        }
    }

    function sendPusherMessage(messageObject) {
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
        
        totalMessagesToday++;
        
        localStorage.setItem('totalMessagesToday', JSON.stringify(totalMessagesToday));
        
        updateTotalMessagesDisplay();

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function updateTotalMessagesDisplay() {
        totalMessagesDisplay.textContent = `Total messages sent today: ${totalMessagesToday}`;
    }

    function storeMessageInLocalStorage(messageObject) {
        let storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
        
        storedMessages.push(messageObject);
        
        localStorage.setItem('messages', JSON.stringify(storedMessages));
    }
});