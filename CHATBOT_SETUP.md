# Barber Zadar Chatbot - Setup Guide

## Overview
A professional AI-powered chatbot has been integrated into your Barber Zadar website. The chatbot is powered by OpenAI's GPT-3.5-turbo model and is ready to assist customers with information about your services, pricing, location, and more.

## Files Added
- **chatbot.js** - Main chatbot logic and OpenAI integration
- **chatbot.css** - Professional styling matching your barber shop theme
- **index.html** - Updated with chatbot references

## Setup Instructions

### Step 1: Get Your OpenAI API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account (create one if needed)
3. Click "Create new secret key"
4. Copy the API key (you won't be able to see it again)
5. Keep this key safe and never share it publicly

### Step 2: Important Security Note
**CRITICAL:** The current implementation exposes your API key in client-side code, which is a security risk. For production deployment, you should:

#### Option A: Use a Backend Server (RECOMMENDED)
Create a backend endpoint that handles OpenAI requests:

**Node.js/Express Example:**
```javascript
// backend/routes/chat.js
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const router = express.Router();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Store in environment variable
});
const openai = new OpenAIApi(configuration);

router.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
        });
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

Then update **chatbot.js** line 135 to call your backend instead of directly calling OpenAI.

#### Option B: Use OpenAI Proxy Service
Use a service like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) to create a secure backend without managing servers.

### Step 3: Configure the API Key

**For Development (Testing Only):**
1. Open `chatbot.js`
2. Find line 2: `const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';`
3. Replace with your actual API key: `const OPENAI_API_KEY = 'sk-xxxxx...';`
4. Test the chatbot on your website

**For Production (Recommended):**
- Set up a backend server as described in Option A above
- Never commit API keys to version control
- Use environment variables to store sensitive data

### Step 4: Customize the Chatbot

Edit the **Chatbot System Prompt** in `chatbot.js` (around line 137) to customize how the chatbot responds:

```javascript
const systemPrompt = `Ja sam pomoćnik barber salona "Barber Zadar"...`;
```

Customize this with your specific details:
- Business hours
- Services offered
- Location details
- Contact information
- Any special offers

### Step 5: Test the Chatbot
1. Open your website in a browser
2. Click the 💬 button in the bottom-right corner
3. Ask questions like:
   - "Koja je vaša lokacija?"
   - "Koja je cijena šišanja?"
   - "Kada ste otvoreni?"

## Features

✅ **Professional UI** - Matches your barber shop's gold and dark theme
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Chat History** - Maintains context across multiple messages
✅ **Typing Indicator** - Shows when the bot is "thinking"
✅ **Error Handling** - Graceful error messages
✅ **Smooth Animations** - Professional transitions and effects
✅ **Croatian Support** - Fully translated interface
✅ **Easy Integration** - Just include the two files

## Customization Examples

### Change the Chatbot Color
Edit `chatbot.css` and replace all instances of `#c5a059` (gold) with your preferred color:
```css
#chatbot-container {
    border: 2px solid #YOUR_COLOR;
}
```

### Change the Emoji Button
Edit `chatbot.js` line 26:
```javascript
<button id="chatbot-toggle" class="chatbot-toggle">
    💬  <!-- Change this emoji -->
</button>
```

### Adjust Response Behavior
Edit the parameters in `chatbot.js` around line 137:
```javascript
temperature: 0.7,  // Lower (0-0.3) = more consistent, Higher (0.7-1) = more creative
max_tokens: 500,   // Maximum response length
```

## Troubleshooting

### "Nevaljani API ključ" Error
- Check that your API key is correct
- Verify you have credit in your OpenAI account
- Ensure the key hasn't expired

### "PreMany zahtjeva" Error
- You're making too many requests too quickly
- Wait a few seconds before asking another question
- Consider implementing rate limiting

### Chatbot Not Appearing
- Check browser console (F12) for JavaScript errors
- Verify `chatbot.css` and `chatbot.js` are in the same folder
- Ensure both files are properly referenced in `index.html`

### API Key Exposure Warning
If you accidentally expose your API key:
1. Go to [OpenAI API Keys page](https://platform.openai.com/api-keys)
2. Delete the exposed key immediately
3. Create a new API key
4. Update your configuration

## Cost Considerations
OpenAI API calls have associated costs. The GPT-3.5-turbo model is relatively inexpensive:
- Typical conversation: ~0.0005 USD per message
- Monitor your usage at [https://platform.openai.com/usage/overview](https://platform.openai.com/usage/overview)

## Next Steps

1. **Add to Other Pages**: Include the chatbot on all pages (cjenik.html, galerija.html, lokacija.html) by:
   - Adding `<link rel="stylesheet" href="chatbot.css">` to the `<head>`
   - Adding `<script src="chatbot.js"></script>` before `</body>`

2. **Analytics**: Add tracking to see which questions customers ask most frequently

3. **Handoff to Human**: Integrate with a live chat service for complex inquiries

4. **Knowledge Base**: Periodically update the system prompt with new services and pricing

## Support
For OpenAI API documentation, visit: [https://platform.openai.com/docs/api-reference](https://platform.openai.com/docs/api-reference)

---
**Last Updated:** February 2026
**Status:** Ready for deployment
