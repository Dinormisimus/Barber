// OpenAI Chatbot Configuration
const OPENAI_API_KEY = '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'; // Replace with your API key
const OPENAI_MODEL = 'gpt-3.5-turbo';

// Chatbot state
let chatHistory = [];
let isChatOpen = false;

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
});

function initializeChatbot() {
    // Create chatbot HTML structure
    const chatbotHTML = `
        <!-- Chatbot Container -->
        <div id="chatbot-container" class="chatbot-container">
            <!-- Chatbot Header -->
            <div class="chatbot-header">
                <h3>Barber Zadar Assistant</h3>
                <button id="chatbot-close" class="chatbot-close">✕</button>
            </div>
            
            <!-- Messages Box -->
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="chatbot-message bot-message">
                    <p>Pozdrav! 👋 Ja sam asistent barber salona Zadar. Mogu ti pomoći sa informacijama o našim uslugama, cijenom, lokaciji i rezervaciji. Kako mogu pomoći?</p>
                </div>
            </div>
            
            <!-- Input Area -->
            <div class="chatbot-input-box">
                <input 
                    type="text" 
                    id="chatbot-input" 
                    placeholder="Napiši pitanje..." 
                    class="chatbot-input"
                />
                <button id="chatbot-send" class="chatbot-send">Pošalji</button>
            </div>
        </div>
        
        <!-- Chatbot Toggle Button -->
        <button id="chatbot-toggle" class="chatbot-toggle">
            💬
        </button>
    `;
    
    // Append chatbot to body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    // Setup event listeners
    setupChatbotListeners();
}

function setupChatbotListeners() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    
    // Toggle chatbot open/close
    toggleBtn.addEventListener('click', toggleChatbot);
    closeBtn.addEventListener('click', toggleChatbot);
    
    // Send message on button click or Enter key
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
}

function toggleChatbot() {
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');
    const waButton = document.querySelector('.wa-float');
    
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        container.classList.add('open');
        toggle.classList.add('hidden');
        if (waButton) waButton.classList.add('chat-open');
        document.getElementById('chatbot-input').focus();
    } else {
        container.classList.remove('open');
        toggle.classList.remove('hidden');
        if (waButton) waButton.classList.remove('chat-open');
    }
}

async function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const messagesBox = document.getElementById('chatbot-messages');
    const userMessage = input.value.trim();
    
    if (!userMessage) return;
    
    // Clear input
    input.value = '';
    
    // Add user message to chat
    addMessageToChat(userMessage, 'user');
    
    try {
        // Show typing indicator
        addTypingIndicator();
        
        // Get response from OpenAI
        const response = await getOpenAIResponse(userMessage);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add bot response to chat
        addMessageToChat(response, 'bot');
    } catch (error) {
        removeTypingIndicator();
        console.error('Error:', error);
        addMessageToChat('Izvinjavam se, došlo je do greške. Molim pokušaj ponovno.', 'bot');
    }
}

function addMessageToChat(message, sender) {
    const messagesBox = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = sender === 'user' ? 'chatbot-message user-message' : 'chatbot-message bot-message';
    
    messageDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
    
    messagesBox.appendChild(messageDiv);
    
    // Auto scroll to bottom
    messagesBox.scrollTop = messagesBox.scrollHeight;
    
    // Add to history
    chatHistory.push({ role: sender === 'user' ? 'user' : 'assistant', content: message });
}

function addTypingIndicator() {
    const messagesBox = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chatbot-message bot-message typing';
    typingDiv.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    
    messagesBox.appendChild(typingDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
}

async function getOpenAIResponse(userMessage) {
    // Koristi lokalni backend server umjesto direktnog OpenAI API-ja
    
    try {
        const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: chatHistory
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server greška: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Nepoznata greška');
        }
        
        return data.reply;
    } catch (error) {
        console.error('Chat Error:', error);
        throw error;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
