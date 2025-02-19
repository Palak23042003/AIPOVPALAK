const API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Get references to DOM elements
const chatDisplay = document.querySelector('.chat-box');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendBtn');

// Initialize chat with an empty state
chatDisplay.innerHTML = '<p class="bot-message">How can I assist you today?</p>';

async function fetchGroqData(messages) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: messages
            })
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response received.';
    } catch (error) {
        console.error(error);
        return 'An error occurred. Please try again later.';
    }
}

function appendMessage(content, isUser = false, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    if (isError) messageDiv.classList.add('error-message');
    messageDiv.textContent = content;
    chatDisplay.appendChild(messageDiv);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

async function handleUserInput() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, true);
    userInput.value = '';

    const chatHistory = Array.from(chatDisplay.children).map(msg => ({
        role: msg.classList.contains('user-message') ? 'user' : 'assistant',
        content: msg.textContent
    }));

    const botResponse = await fetchGroqData(chatHistory);
    appendMessage(botResponse, false, botResponse.startsWith('Error'));
}

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') handleUserInput();
});
