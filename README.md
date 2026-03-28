# A2UI Agent Prototype

A prototype demonstrating **A2UI** - an AI-powered interface generation system where users describe what they need in natural language, and an AI agent creates the corresponding user interface dynamically.

## What It Does

This application allows users to request user interfaces using plain English descriptions. For example:
- "I need a login form"
- "Create a feedback survey"
- "Build a contact form with name, email, and message"
- "Assemble a fprm for entering driver license details"
- "Maak een formulier voor rijbewijsgegevens"

The system uses Google's Gemini AI to interpret the request and generate a structured UI schema, which is then rendered as actual HTML elements in the browser. The AI understands component types like text, inputs, and buttons, and arranges them in vertical or horizontal layouts.

Note: the rendered form will depend on country context - ask for a driver license form or a formulier voor een rijbewijs for example.

## Features

- **Natural Language UI Generation**: Describe interfaces in plain English
- **AI-Powered**: Uses Google Gemini 2.5 Flash for intelligent UI interpretation
- **Dynamic Rendering**: Real-time UI generation and display
- **Component Registry**: Supports text, input fields, and buttons
- **Responsive Design**: Clean, modern interface with good typography

## Prerequisites

- Node.js (v16 or higher)
- Google Gemini API key

## Setup

1. **Clone or download the project**

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `server` directory with your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the server:**
   ```bash
   cd server
   node server.js
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Usage

1. Open the application in your browser
2. In the text area, describe the interface you want (e.g., "I need a login form")
3. Click "Request UI"
4. The AI will generate and display the interface in the canvas area

## How It Works

### Backend (server/)
- Express.js server serving static files and API endpoints
- `/generate-ui` endpoint accepts natural language prompts
- Uses Google Gemini AI to convert prompts into structured JSON schemas
- Follows a predefined component registry and schema structure

### Frontend (client/)
- Vanilla JavaScript renderer that interprets AI-generated schemas
- Component registry for rendering different UI elements
- Real-time status updates during AI processing

## Component Types

The system supports these UI components:
- **Text**: Headings and paragraphs (h1, h2, p)
- **Input**: Text, number, email, and password fields
- **Button**: Primary and secondary action buttons

## Adding a New Component (e.g., checkbox)

To add a new component type like `checkbox`, follow these steps:

1. Update the AI component registry contract in `server/server.js` (inside `A2UI_SYSTEM_PROMPT`) with the new definition. For example:
   - `"checkbox": { "type": "checkbox", "label": string, "id": string, "checked": boolean }

2. Extend the renderer in `client/renderer.js`:
   ```js
   checkbox: (props) => {
       const wrapper = document.createElement('div');
       wrapper.className = 'a2ui-input-wrapper';

       const label = document.createElement('label');
       label.setAttribute('for', props.id);
       label.innerText = props.label;

       const input = document.createElement('input');
       input.type = 'checkbox';
       input.id = props.id;
       input.checked = !!props.checked;
       input.className = 'a2ui-checkbox';

       wrapper.appendChild(input);
       wrapper.appendChild(label);
       return wrapper;
   },
   ```

3. Optionally add CSS styles in `client/style.css` for `.a2ui-checkbox` and spacing.

Then restart the server and issue a prompt that includes a checkbox request. For example
```
een formulier voor aanmelden voor een event, met naam, email adres en de keuze voor 1 of meer events (Pannenboeken Avond, Schaakfestijn, Pita en Pizza)
```

## API Schema

The AI generates responses in this JSON format:
```json
{
  "layout": "vertical" | "horizontal",
  "components": [
    {
      "type": "text" | "input" | "button",
      // ... component-specific properties
    }
  ]
}
```

## Development

The application is built with:
- **Backend**: Node.js, Express, Google Gemini AI
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Architecture**: Client-server with REST API

## Future Enhancements

- More component types (dropdowns, checkboxes, etc.)
- Component styling customization
- UI persistence and editing
- Multi-step form workflows
- Integration with other AI models

## License

This is a prototype project for demonstration purposes.