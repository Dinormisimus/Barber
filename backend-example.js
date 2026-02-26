/**
 * SECURE BACKEND EXAMPLE - Node.js + Express
 * 
 * This file shows how to securely handle OpenAI API calls from a backend server.
 * This prevents exposing your API key in client-side code.
 * 
 * Installation:
 * npm install express openai cors dotenv
 * 
 * Environment Variables (.env):
 * OPENAI_API_KEY=your_api_key_here
 * PORT=3001
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/chat
 * Receives messages from the chatbot and returns OpenAI response
 * 
 * Request body:
 * {
 *   "messages": [
 *     { "role": "user", "content": "Kada ste otvoreni?" },
 *     { "role": "assistant", "content": "..." }
 *   ]
 * }
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        // Validate input
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        // System prompt for the chatbot
        const systemPrompt = {
            role: 'system',
            content: `Ja sam AI asistent barber salona "Barber Zadar" u Zadru, Hrvatska. 
Salon nudi siguran i čist prostor za sve vrste muške frizure. 
Radni sat: Pon-Pet 8:00-20:00, Sub 9:00-18:00, Ned zatvoreno.
Usluge: Muške frizure, brijanje, šišanje brodova, farbanje kose.
Lokacija: Zadar, Hrvatska.
Odgovori ljubazno i profesionalno samo na hrvatskom jeziku. 
Ako korisnik pita nešto što nije vezano uz salon, ljubazno preusmeri na temu salona.`
        };

        // Create chat completion
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [systemPrompt, ...messages],
            temperature: 0.7,
            max_tokens: 500,
        });

        const reply = response.choices[0].message.content;

        res.json({ success: true, reply });
    } catch (error) {
        console.error('OpenAI API Error:', error);

        // Handle specific errors
        if (error.status === 401) {
            return res.status(401).json({ error: 'Invalid API key' });
        } else if (error.status === 429) {
            return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
        } else if (error.status === 500) {
            return res.status(500).json({ error: 'OpenAI service error. Please try again.' });
        }

        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🤖 Chatbot API server running on port ${PORT}`);
    console.log(`POST http://localhost:${PORT}/api/chat`);
});
