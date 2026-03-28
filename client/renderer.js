/**
 * renderer.js
 * The A2UI Rendering Engine
 */

const componentRegistry = {
    // Basic text/heading element
    text: (props) => {
        const el = document.createElement(props.level || 'p');
        el.innerText = props.content;
        el.className = 'a2ui-text';
        return el;
    },

    // Standard text input
    input: (props) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'a2ui-input-wrapper';
        
        const label = document.createElement('label');
        label.innerText = props.label;
        label.setAttribute('for', props.id);

        const input = document.createElement('input');
        input.type = props.inputType || 'text';
        input.id = props.id;
        input.placeholder = props.placeholder || '';
        input.className = 'a2ui-input';

        wrapper.appendChild(label);
        wrapper.appendChild(document.createElement('br'));
        wrapper.appendChild(input);
        return wrapper;
    },

    // Action button
    button: (props) => {
        const btn = document.createElement('button');
        btn.innerText = props.label;
        btn.className = `a2ui-button ${props.variant || 'primary'}`;
        
        // In a real app, 'action' would map to a specific function
        btn.onclick = () => {
            console.log(`A2UI Action Triggered: ${props.action}`);
            alert(`Executing: ${props.action}`);
        };
        return btn;
    }
};

/**
 * Main function to turn the A2UI JSON into HTML
 */
function renderA2UI(schema, targetElementId = 'ui-canvas') {
    const canvas = document.getElementById(targetElementId);
    if (!canvas) return;

    // 1. Clear the canvas for the new "Agent State"
    canvas.innerHTML = '';

    // 2. Create the layout container
    const container = document.createElement('div');
    container.className = schema.layout === 'horizontal' 
        ? 'a2ui-container-horizontal' 
        : 'a2ui-container-vertical';

    // 3. Map components from schema to registry
    schema.components.forEach(comp => {
        const builder = componentRegistry[comp.type];
        if (builder) {
            container.appendChild(builder(comp));
        } else {
            console.warn(`A2UI Warning: Component type "${comp.type}" not found in registry.`);
        }
    });

    // 4. Inject into the DOM
    canvas.appendChild(container);
}

// Export for use in index.html
window.renderA2UI = renderA2UI;