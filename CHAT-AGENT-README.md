# Chat Agent for Dawn Theme

A modern, AI-powered customer service chat agent that can be easily integrated into your Shopify Dawn theme. This feature provides automated responses to common customer inquiries and can be customized to match your brand.

## 🚀 Features

- **Smart Response System**: Automatically responds to common customer inquiries about orders, shipping, returns, and products
- **Quick Action Buttons**: Pre-defined buttons for common support topics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Minimizable Interface**: Can be minimized to a floating chat button
- **Customizable**: Easy to customize messages, appearance, and behavior
- **Accessible**: Built with proper ARIA labels and keyboard navigation
- **Unread Notifications**: Shows notification badges when minimized

## 📦 Installation

### Method 1: Add as a Section (Recommended)

1. The chat agent section (`sections/chat-agent.liquid`) is already included
2. Add the section to any template in the theme editor:
   - Go to your Shopify admin → Online Store → Themes
   - Click "Customize" on your Dawn theme
   - Navigate to any page where you want the chat agent
   - Click "Add section" and select "Chat Agent"

### Method 2: Add as a Widget Snippet

For a floating chat widget that appears on all pages:

1. Open your theme's `layout/theme.liquid` file
2. Add this line before the closing `</body>` tag:
   ```liquid
   {% render 'chat-agent-widget' %}
   ```

## ⚙️ Configuration

### Section Settings

When using the chat agent as a section, you can customize:

- **Heading**: Main title for the chat section
- **Description**: Optional description text
- **Agent Name**: Name displayed in the chat header
- **Welcome Message**: First message customers see
- **Input Placeholder**: Placeholder text for the message input
- **Quick Actions**: Toggle individual quick action buttons
- **Padding**: Top and bottom padding for the section

### Widget Snippet Parameters

When using the snippet, you can pass parameters:
```liquid
{% render 'chat-agent-widget',
   agent_name: 'Your Store Support',
   welcome_message: 'Hi! How can we help you today?',
   show_on_mobile: true,
   position: 'bottom-right'
%}
```

Available parameters:
- `agent_name`: Custom agent name (default: "Support Agent")
- `welcome_message`: Custom welcome message
- `show_on_mobile`: Show on mobile devices (default: true)
- `position`: 'bottom-right' or 'bottom-left' (default: 'bottom-right')

## 🎨 Customization

### Styling

The chat agent uses CSS custom properties for easy theming. You can override these in your theme's CSS:

```css
:root {
  --chat-agent-primary-color: rgb(var(--color-button));
  --chat-agent-text-color: rgb(var(--color-foreground));
  --chat-agent-background: rgb(var(--color-background));
  --chat-agent-border-radius: 1.2rem;
}
```

### Response Customization

To customize the automated responses, edit the `responses` object in `assets/chat-agent.js`:

```javascript
this.responses = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What can I assist you with?",
    // Add more greeting variations
  ],
  shipping: [
    "We offer free shipping on orders over $50.",
    // Add your shipping policies
  ],
  // Customize other response categories
};
```

### Adding New Response Categories

1. Add a new category to the `responses` object
2. Add matching patterns in the `generateResponse` method
3. Handle the new category in `handleQuickActionResponse`

Example:
```javascript
// In responses object
sizing: [
  "Please check our size guide for accurate measurements.",
  "We offer exchanges for sizing issues within 30 days."
],

// In generateResponse method
if (this.matchesPattern(lowerMessage, ['size', 'sizing', 'fit', 'measurements'])) {
  return this.getRandomResponse('sizing');
}
```

## 🔧 Advanced Features

### Integration with Customer Service Tools

The chat agent can be extended to integrate with:
- Help desk systems (Zendesk, Freshdesk)
- Live chat platforms (Intercom, Drift)
- AI services (ChatGPT API, Dialogflow)

### Analytics Integration

Track chat interactions with Google Analytics:

```javascript
// Add to chat-agent.js
gtag('event', 'chat_interaction', {
  'event_category': 'Customer Support',
  'event_label': 'Message Sent'
});
```

### Custom Quick Actions

Add custom quick action buttons by modifying the section schema and JavaScript:

1. Add new checkbox settings in the section schema
2. Add corresponding buttons in the liquid template
3. Handle the new actions in the JavaScript

## 🎯 Best Practices

### Response Quality
- Keep responses helpful and concise
- Include specific information about your store policies
- Provide clear next steps for customers
- Update contact information to match your actual support channels

### Performance
- The chat agent loads asynchronously to avoid blocking page load
- CSS and JavaScript are optimized for minimal impact
- Messages are stored in memory only (not persistent)

### Accessibility
- All interactive elements have proper ARIA labels
- Keyboard navigation is fully supported
- Color contrast meets WCAG guidelines
- Screen reader compatible

## 🛠️ Troubleshooting

### Chat Not Appearing
1. Check that the CSS and JavaScript files are properly linked
2. Verify the section is added to the template
3. Check browser console for JavaScript errors

### Styling Issues
1. Ensure CSS custom properties are defined
2. Check for conflicting styles from other components
3. Verify responsive breakpoints match your theme

### Functionality Problems
1. Check that all required HTML elements have correct data attributes
2. Verify JavaScript event listeners are properly bound
3. Test in different browsers and devices

## 🔄 Updates and Maintenance

### Updating Responses
Regularly review and update automated responses to ensure accuracy:
- Monitor customer inquiries to identify new response patterns
- Update shipping and return policies as they change
- Add seasonal or promotional information as needed

### Performance Monitoring
- Monitor chat usage through analytics
- Track customer satisfaction with responses
- Identify common questions that need better answers

## 📱 Mobile Optimization

The chat agent is fully optimized for mobile:
- Touch-friendly interface with appropriate button sizes
- Full-screen chat on mobile devices
- Responsive design adapts to all screen sizes
- Optimized for both portrait and landscape orientations

## 🔐 Privacy and Security

- No customer data is stored permanently
- Messages are processed client-side only
- No external API calls by default
- Compliant with GDPR and privacy regulations

## 📞 Support

For questions about implementing or customizing the chat agent:
1. Check this documentation first
2. Review the commented code in the source files
3. Test changes in a development environment
4. Contact your developer for advanced customizations

---

**Note**: This chat agent provides automated responses based on predefined patterns. For complex customer service needs, consider integrating with a full customer service platform or live chat solution.