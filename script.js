const chatBody = document.querySelector(".chat-body");
const inputMessage = document.querySelector(".message-input");
const sendButton = document.querySelector("#send-message"); // Fixed selector typo

//api setup
//using the freee gemini apis to get it work
const API_KEY = 'AIzaSyCX21pj7OgdEmBlSZrSFUGMKWG0KeOeiIY';
const api_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
const userData = {
    message: null
};

const createMessageElement = (content, isUser) => {
    const messageDiv = document.createElement("div");
    const textDiv = document.createElement("div");
    
    textDiv.classList.add("text-message");
    textDiv.textContent = content;
    
    if (isUser) {
        messageDiv.classList.add("message-user");
        textDiv.classList.add("user-message");
        messageDiv.appendChild(textDiv);
    } else {
        const botAvatar = document.createElement("div");
        botAvatar.innerHTML = `
            <svg class="bot-avatar1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c-.83 0-1.5-.67-1.5-1.5S7.67 8 8.5 8s1.5.67 1.5 1.5S9.33 11 8.5 11zm7 0c-.83 0-1.5-.67-1.5-1.5S14.67 8 15.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-3.5 3c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z"/>
            </svg>
        `;
        
        messageDiv.classList.add("message-bot");
        messageDiv.appendChild(botAvatar);
        messageDiv.appendChild(textDiv);
    }
    
    return messageDiv;
};

const generatebotresponse = async () => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            contents: [{
                parts: [{ text: userData.message }]
            }]
        })
    };
    
    try {
        const res = await fetch(api_url, requestOptions);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error.message);
        
       //response from the API data
        const botResponseText = data.candidates[0].content.parts[0].text;
        return botResponseText;
    } catch(error) {
        console.log(error);
        return "Sorry, I encountered an error. Please try again.";
    }
};

const handleOutgoingMessage = async (userMessage) => {
    if (!userMessage.trim()) return;
    
    userData.message = userMessage; 
    
    const outgoingMessage = createMessageElement(userMessage, true);
    chatBody.appendChild(outgoingMessage);
    inputMessage.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;
    
    setTimeout(async () => {
        const thinkingDiv = document.createElement("div");
        thinkingDiv.classList.add("message-bot");
        
        const botAvatar = document.createElement("div");
        botAvatar.innerHTML = `
            <svg class="bot-avatar1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c-.83 0-1.5-.67-1.5-1.5S7.67 8 8.5 8s1.5.67 1.5 1.5S9.33 11 8.5 11zm7 0c-.83 0-1.5-.67-1.5-1.5S14.67 8 15.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-3.5 3c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z"/>
            </svg>
        `;
        
        const thinkingIndicator = document.createElement("div");
        thinkingIndicator.classList.add("think-indicator");
        thinkingIndicator.innerHTML = `
            <div class="dot">.</div>
            <div class="dot">.</div>
            <div class="dot">.</div>
        `;
        
        thinkingDiv.appendChild(botAvatar);
        thinkingDiv.appendChild(thinkingIndicator);
        chatBody.appendChild(thinkingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        try {
            const botResponseText = await generatebotresponse();
            thinkingDiv.remove();
            const botResponse = createMessageElement(botResponseText, false);
            chatBody.appendChild(botResponse);
        } catch (error) {
            thinkingDiv.remove();
            const errorResponse = createMessageElement("Sorry, I encountered an error. Please try again.", false);
            chatBody.appendChild(errorResponse);
        }
        
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 500);
};

// Event listeners
inputMessage.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleOutgoingMessage(inputMessage.value);
    }
});

sendButton.addEventListener("click", () => {
    handleOutgoingMessage(inputMessage.value);
});

// Initialize
window.addEventListener("DOMContentLoaded", () => {
    const welcomeMessage = createMessageElement("Hello! How can I help you today?", false);
    chatBody.appendChild(welcomeMessage);
});