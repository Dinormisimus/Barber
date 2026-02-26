require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: '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',
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        const systemPrompt = {
            role: 'system',
            content: `Ja sam pomoćnik barber salona "Barber Zadar" u Zadru, Hrvatska. 
Salon nudi siguran i čist prostor za sve vrste muške frizure. 
Radni sat: Pon-Pet 8:00-20:00, Sub 9:00-18:00, Ned zatvoreno.
Usluge: Muške frizure, brijanje, šišanje brodova, farbanje kose.
Lokacija: Zadar, Hrvatska.
Odgovori ljubazno i profesionalno samo na hrvatskom jeziku. 
Ako korisnik pita nešto što nije vezano uz salon, ljubazno preusmeri na temu salona.`
        };

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [systemPrompt, ...messages],
            temperature: 0.7,
            max_tokens: 500,
        });

        const reply = response.choices[0].message.content;
        res.json({ success: true, reply });
    } catch (error) {
        console.error('OpenAI API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🤖 Chatbot server pokrenut: http://localhost:${PORT}`);
});
