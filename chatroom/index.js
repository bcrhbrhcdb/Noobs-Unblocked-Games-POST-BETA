const ably = new Ably.Realtime('YPFBOw.qF16Aw:PSCKwfNVsUcDpbY_vUK-1qYofIDSpdzyPdvLQrMHCf0');
const channel = ably.channels.get('chat-channel');

let nickname = localStorage.getItem('nickname') || '';
let messages, form, input, typingIndicator, onlineUsersDiv, userCountDisplay, pingSound, scrollDownButton;

const usersOnline = new Set();
const colors = {};

function initializeElements() {
    messages = document.getElementById('messages');
    form = document.getElementById('form');
    input = document.getElementById('input');
    typingIndicator = document.getElementById('typing');
    onlineUsersDiv = document.querySelector('.online-users');
    userCountDisplay = document.getElementById('user-count');
    pingSound = document.getElementById('ping-sound');
    scrollDownButton = document.getElementById('scroll-down-button');

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    if (input) {
        input.addEventListener('keypress', handleTyping);
    }

    if (scrollDownButton) {
        scrollDownButton.addEventListener("click", handleScrollDown);
    }

    const setNicknameButton = document.getElementById('set-nickname');
    if (setNicknameButton) {
        setNicknameButton.addEventListener('click', handleSetNickname);
    }
}

function updateOnlineUsers() {
    if (userCountDisplay) {
        userCountDisplay.textContent = usersOnline.size;
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function handleSetNickname() {
    const nicknameInput = document.getElementById('nickname');
    if (!nicknameInput) return;

    const nicknameValue = nicknameInput.value.trim();
    
    if (nicknameValue && nicknameValue.length <= 20 && !nicknameValue.includes(' ') && /^[a-zA-Z0-9_]+$/.test(nicknameValue)) {
        if (nickname) {
            channel.publish('name-changed', { oldName: nickname, newName: nicknameValue });
        } else {
            channel.publish('user-connected', nicknameValue);
        }

        nickname = nicknameValue;
        localStorage.setItem('nickname', nickname);
        usersOnline.add(nickname);
        colors[nickname] = getRandomColor();
        updateOnlineUsers();
        
        const setNicknameButton = document.getElementById('set-nickname');
        if (setNicknameButton) {
            setNicknameButton.textContent = 'Change Name';
        }
        
        nicknameInput.value = '';
    } else {
        alert("Nickname must not contain spaces or special characters (except _), and must be less than or equal to 20 characters.");
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (input && input.value && nickname) {
        const messageData = { 
            user: nickname, 
            text: input.value, 
            time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) 
        };
        
        channel.publish('chat-message', messageData);
        input.value = '';
        if (typingIndicator) typingIndicator.textContent = '';
        scrollToBottom();
    } else if (!nickname) {
        alert("Please set your nickname before sending messages.");
    }
}

function handleTyping() {
    if (nickname) {
        channel.publish('typing', nickname);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            if (typingIndicator) typingIndicator.textContent = '';
        }, 1000);
        
        if (typingIndicator) {
            typingIndicator.textContent = `${nickname} is typing...`;
            typingIndicator.style.display = 'block';
            setTimeout(() => typingIndicator.style.display = 'none', 3000);
        }
    } else {
        alert("Please set your nickname before typing.");
    }
}

function scrollToBottom() {
    if (messages) {
        messages.scrollTop = messages.scrollHeight;

        if (scrollDownButton) {
            scrollDownButton.style.display = messages.scrollHeight > messages.clientHeight ? 'block' : 'none';
        }
    }
}

function handleScrollDown() {
    scrollToBottom();
    if (scrollDownButton) {
        scrollDownButton.style.display = 'none';
    }
}

let typingTimeout;

channel.subscribe('chat-message', function(message) {
    if (!messages) return;

    const itemContainer = document.createElement('div');
    const item = document.createElement('li');

    item.textContent = `${message.data.user}: ${message.data.text}`;
    
    item.style.color = colors[message.data.user] || 'black';

    const timeSpan = document.createElement('span');
    timeSpan.classList.add("message-time");
    timeSpan.textContent = `(${message.data.time})`;
    item.appendChild(timeSpan);

    item.classList.add("message");

    if (message.data.user === nickname) {
        item.classList.add("my-message");
        itemContainer.style.justifyContent = "flex-end";
    } else {
        item.classList.add("other-message");
        itemContainer.style.justifyContent = "flex-start";
    }

    itemContainer.classList.add("message-container");
    itemContainer.appendChild(item);

    if (message.data.text.includes(`@${nickname}`)) {
        if (pingSound) pingSound.play();
        item.classList.add('pinged');
        setTimeout(() => item.classList.remove('pinged'), 3000);
        window.scrollTo(0, messages.scrollHeight);
    }

    messages.appendChild(itemContainer);
    scrollToBottom();
});

channel.subscribe('user-connected', function(user) {
    usersOnline.add(user);
    colors[user] = getRandomColor();
    updateOnlineUsers();
});

channel.subscribe('user-disconnected', function(user) {
    usersOnline.delete(user);
    updateOnlineUsers();
});

channel.subscribe('name-changed', function(data) {
    if (!messages) return;

    const itemContainer = document.createElement('div');
    const item = document.createElement('li');

    item.textContent = `${data.oldName} has changed their name to ${data.newName}.`;
    
    itemContainer.classList.add("message-container");
    itemContainer.appendChild(item);
    messages.appendChild(itemContainer);
});

channel.subscribe('typing', function(user) {
    if (typingIndicator) {
        typingIndicator.textContent += `${user} is typing... `;
    }
});

function sendPrivateMessage(receiverNickname, messageText) {
    const privateMessageData = { from: nickname, to: receiverNickname, text: messageText };
    channel.publish('private-message', privateMessageData);
}

channel.subscribe('private-message', function(message) {
    if (message.data.to === nickname && messages) {
        const itemContainer = document.createElement('div');
        const item = document.createElement('li');
        item.classList.add('private-message');
        item.textContent = `Private from ${message.data.from}: ${message.data.text}`;
        itemContainer.appendChild(item);
        messages.appendChild(itemContainer);
        window.scrollTo(0, messages.scrollHeight);
    }
});

document.addEventListener('DOMContentLoaded', initializeElements);