import { GoogleGenAI } from '@google/genai';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, '../client')));

// Route to serve the index.html on the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.post('/generate-ui', async (req, res) => {
    const userPrompt = req.body.prompt;
console.log('Received user prompt:', userPrompt);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: "user", parts: [{ text: A2UI_SYSTEM_PROMPT.replace('__USERPROMPT__', userPrompt) }] }
        ],
        response_format: { type: "json_object" } // Forces JSON mode
    });
    if (!response.text) {
        throw new Error('No response text received from Gemini API');
    }

    let content = response.text.trim();

    content = content.replace(/^```json\s*/gm, '');
    content = content.replace(/^```\s*/gm, '');
    content = content.replace(/```$/gm, '');
    content = content.trim();


    console.log('Raw Gemini Response:', response);
    console.log('Cleaned Content:', content);


    // For this prototype, we'll simulate the LLM response:
    const mockLLMResponse = {
        layout: "vertical",
        components: [
            { type: "text", content: "Shipping Details" },
            { type: "input", label: "Full Name", placeholder: "John Doe", id: "name" },
            { type: "input", label: "Address", placeholder: "123 Main St", id: "addr" },
            { type: "button", label: "Submit Order", action: "submit" }
        ]
    };

    res.json(JSON.parse(content));
});

app.listen(3000, () => console.log('A2UI Backend running on port 3000'));



const A2UI_SYSTEM_PROMPT = `### ROLE
You are a UI Architect Agent. Your goal is to translate user requests into a structured UI schema (A2UI) that a frontend renderer can interpret.

### CONSTRAINTS
1. ONLY respond with a valid JSON object. 
2. Do NOT include any conversational text, explanations, or markdown code blocks (unless specifically requested for debugging).
3. Use only the components defined in the COMPONENT REGISTRY below.

### COMPONENT REGISTRY
- "text": { "type": "text", "content": string, "level": "h1"|"h2"|"p" }
- "input": { "type": "input", "label": string, "placeholder": string, "id": string, "inputType": "text"|"number"|"email" }
- "button": { "type": "button", "label": string, "action": string, "variant": "primary"|"secondary" }

### SCHEMA STRUCTURE
{
  "layout": "vertical" | "horizontal",
  "components": [
    { ...componentProps }
  ]
}

### EXAMPLES
User: "I need a login form"
Assistant: {
  "layout": "vertical",
  "components": [
    { "type": "text", "content": "Login to your account", "level": "h2" },
    { "type": "input", "label": "Email", "placeholder": "you@example.com", "id": "email_field", "inputType": "email" },
    { "type": "input", "label": "Password", "placeholder": "••••••••", "id": "pass_field", "inputType": "password" },
    { "type": "button", "label": "Login", "action": "submit_login", "variant": "primary" },
     { "type": "checkbox", "label": string, "id": string, "checked": boolean }
  ]
}

### USER REQUEST
__USERPROMPT__
`;
