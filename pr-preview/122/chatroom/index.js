const ably = new Ably.Realtime('YPFBOw.qF16Aw:PSCKwfNVsUcDpbY_vUK-1qYofIDSpdzyPdvLQrMHCf0'); // Your Ably API key
const channel = ably.channels.get('chat-channel');

let nickname = localStorage.getItem('nickname') || '';
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const typingIndicator = document.getElementById('typing');
const onlineUsersDiv = document.querySelector('.online-users');
const userCountDisplay = document.getElementById('user-count');
const pingSound = document.getElementById('ping-sound');
const scrollDownButton = document.getElementById('scroll-down-button');

const usersOnline = new Set();
const colors = {}; // Store colors for each user

// Function to update online users display
function updateOnlineUsers() {
    userCountDisplay.textContent = usersOnline.size;
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Set Nickname
document.getElementById('set-nickname').addEventListener('click', () => {
    const nicknameInput = document.getElementById('nickname').value.trim();
    
    // Check for valid nickname with character limit
    if (nicknameInput && nicknameInput.length <= 20 && !nicknameInput.includes(' ') && /^[a-zA-Z0-9_]+$/.test(nicknameInput)) {
        if (nickname) {
            channel.publish('name-changed', { oldName: nickname, newName: nicknameInput });
        } else {
            channel.publish('user-connected', nicknameInput);
        }

        nickname = nicknameInput;
        localStorage.setItem('nickname', nickname);
        usersOnline.add(nickname);
        colors[nickname] = getRandomColor(); // Assign a random color
        updateOnlineUsers();
        
        // Change button text after setting name
        document.getElementById('set-nickname').textContent = 'Change Name';
        
        document.getElementById('nickname').value = '';
        
    } else {
        alert("Nickname must not contain spaces or special characters (except _), and must be less than or equal to 20 characters.");
    }
});

// Send Message
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (input.value && nickname) {
        const messageData = { 
            user: nickname, 
            text: input.value, 
            time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) 
        };
        
        channel.publish('chat-message', messageData);
        input.value = ''; // Clear input field
        typingIndicator.textContent = ''; // Clear typing indicator
        scrollToBottom(); // Scroll down to the latest message
    } else if (!nickname) {
        alert("Please set your nickname before sending messages.");
    }
});

// Receive Messages
channel.subscribe('chat-message', function(message) {
   const itemContainer = document.createElement('div');
   const item = document.createElement('li');

   // Format message with time and color
   item.textContent = `${message.data.user}: ${message.data.text}`;
   
   // Set color for the user message
   item.style.color = colors[message.data.user] || 'black';

   // Create a time span element
   const timeSpan = document.createElement('span');
   timeSpan.classList.add("message-time");
   timeSpan.textContent = `(${message.data.time})`;
   item.appendChild(timeSpan);

   item.classList.add("message");

   // Align messages based on sender
   if (message.data.user === nickname) {
       item.classList.add("my-message");
       itemContainer.style.justifyContent = "flex-end"; // Align to right for my messages
   } else {
       item.classList.add("other-message");
       itemContainer.style.justifyContent = "flex-start"; // Align to left for others' messages
   }

   itemContainer.classList.add("message-container");
   itemContainer.appendChild(item);

   // Check for pings in the message
   if (message.data.text.includes(`@${nickname}`)) {
       pingSound.play(); // Play ping sound
       item.classList.add('pinged');
       setTimeout(() => item.classList.remove('pinged'), 3000);
       window.scrollTo(0, messages.scrollHeight); // Scroll to the latest message
   }

   messages.appendChild(itemContainer);
   scrollToBottom(); // Scroll down to latest message after appending

});

// User Connected Notification
channel.subscribe('user-connected', function(user) {
   usersOnline.add(user);
   colors[user] = getRandomColor(); // Assign a random color to new user
   updateOnlineUsers();
});

// User Disconnected Notification
channel.subscribe('user-disconnected', function(user) {
   usersOnline.delete(user);
   updateOnlineUsers();
});

// Name Change Notification
channel.subscribe('name-changed', function(data) {
   const itemContainer = document.createElement('div');
   const item = document.createElement('li');

   item.textContent = `${data.oldName} has changed their name to ${data.newName}.`;
   
   itemContainer.classList.add("message-container");
   itemContainer.appendChild(item);
   messages.appendChild(itemContainer);
});

// Typing Indicator
input.addEventListener('keypress', () => {
   if (nickname) {
       channel.publish('typing', nickname);
       clearTimeout(typingTimeout);
       typingTimeout = setTimeout(() => {
           typingIndicator.textContent = '';
       }, 1000);
       
       typingIndicator.textContent = `${nickname} is typing...`;
       
       // Move typing indicator above chat bar
       typingIndicator.style.display = 'block';
       
       setTimeout(() => typingIndicator.style.display = 'none', 3000); // Hide after some time
      
   } else {
       alert("Please set your nickname before typing.");
   }
});

let typingTimeout;
channel.subscribe('typing', function(user) {
   typingIndicator.textContent += `${user} is typing... `;
});

// Scroll Down Functionality
function scrollToBottom() {
     messages.scrollTop = messages.scrollHeight;

     if (messages.scrollHeight > messages.clientHeight) {
         scrollDownButton.style.display = 'block'; // Show scroll down button when scrolled up
     } else {
         scrollDownButton.style.display = 'none'; // Hide when at bottom
     }
}

// Scroll Down Button Click Event
scrollDownButton.addEventListener("click", () => {
     scrollToBottom();
     scrollDownButton.style.display = 'none'; // Hide button after scrolling down
});

// Private Messaging (basic implementation)
function sendPrivateMessage(receiverNickname, messageText) {
   const privateMessageData = { from: nickname, to: receiverNickname, text: messageText };
   channel.publish('private-message', privateMessageData);
}

// Handle Private Messages
channel.subscribe('private-message', function(message) {
   if (message.data.to === nickname) {
       const itemContainer = document.createElement('div');
       const item = document.createElement('li');
       item.classList.add('private-message');
       item.textContent = `Private from ${message.data.from}: ${message.data.text}`;
       itemContainer.appendChild(item);
       messages.appendChild(itemContainer);
       window.scrollTo(0, messages.scrollHeight);
   }
});