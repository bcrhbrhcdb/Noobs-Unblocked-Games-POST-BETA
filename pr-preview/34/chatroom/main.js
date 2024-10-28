document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messagesContainer");
    const messageInput = document.getElementById("messageInput");
    const nameInput = document.getElementById("nameInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const setNameBtn = document.getElementById("setNameBtn");
    const pingSound = document.getElementById("pingSound");

    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    
    // Retrieve user name from local storage
    let userName = localStorage.getItem(`userName_${gameId}`) || "";

    // If a user name exists, load messages
    if (userName) {
        loadMessages();
        displayWelcomeMessage(userName);
        setNameBtn.textContent = "Change Name"; // Change button text after first set
        nameInput.classList.add('block'); // Hide input after setting name
    }

    setNameBtn.addEventListener("click", () => {
        const newUserName = nameInput.value.trim();
        
        // Check for valid username (no spaces or special characters)
        if (/^[a-zA-Z0-9]+$/.test(newUserName)) {
            // Notify users about the name change in chat
            if (userName) {
                displayMessage({ 
                    name: "System", 
                    message: `${userName} changed their name to ${newUserName}`, 
                    timestamp: new Date().toLocaleTimeString() 
                });
            }
            
            userName = newUserName;
            localStorage.setItem(`userName_${gameId}`, userName);
            loadMessages(); // Reload messages to show welcome message
            displayWelcomeMessage(userName);
        } else {
            alert("Username must not contain spaces or special characters.");
        }
    });

    sendMessageBtn.addEventListener("click", sendMessage);
    
    // Add event listener for Enter key
    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // Use the stored userName or default to "Anonymous"
            const displayName = userName || "Anonymous";
            const timestamp = new Date().toLocaleTimeString();
            const messageObject = { name: displayName, message, timestamp };

            // Check for pinging users
            const mentionedUserMatch = message.match(/@(\w+)/); // Regex to match @username
            if (mentionedUserMatch) {
                const mentionedUser = mentionedUserMatch[1]; // Get the username after '@'
                pingSound.play(); // Play the ping sound

                // Highlight the pinged username in the message
                messageObject.message = message.replace(`@${mentionedUser}`, `<span style='color: red;'>@${mentionedUser}</span>`);
                displayMessage({ 
                    name: "System", 
                    message: `${displayName} pinged ${mentionedUser}!`, 
                    timestamp 
                });
            }

            saveMessage(messageObject);
            displayMessage(messageObject);
            messageInput.value = ''; // Clear input after sending
        } else {
            alert("Please enter a message.");
        }
    }

    function displayWelcomeMessage(name) {
        const welcomeMessage = document.createElement("div");
        welcomeMessage.classList.add("message");
        welcomeMessage.innerHTML = `<span>${name}</span> has joined the chat!`;
        messagesContainer.appendChild(welcomeMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
    }

    function displayMessage({ name, message, timestamp }) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.innerHTML = `<span>${name}</span>: ${message} <time>${timestamp}</time>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
    }

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem(`chatMessages_${gameId}`)) || [];
        messages.forEach(displayMessage);
    }

    function saveMessage(messageObject) {
        const messages = JSON.parse(localStorage.getItem(`chatMessages_${gameId}`)) || [];
        
        // Limit storage duration (e.g., keep only last X messages)
        if (messages.length >= 1000) { // Adjust limit as needed
            messages.shift(); // Remove the oldest message
        }
        
        messages.push(messageObject);
        localStorage.setItem(`chatMessages_${gameId}`, JSON.stringify(messages));
     }
});