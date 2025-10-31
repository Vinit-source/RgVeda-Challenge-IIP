# Testing Modal Component

## Overview
The TestingModal component provides real-time debugging and state inspection for the RgVeda-Challenge-IIP application. It displays all application states in an easy-to-read format.

## Features
- **Real-time State Tracking**: Monitors all app-level and component-level states
- **Color-coded Status**: Different colors indicate state types and values
- **Collapsible UI**: Opens/closes with a floating button in the bottom-right corner
- **Formatted Display**: Smart formatting for different data types (strings, objects, arrays)

## States Tracked

### App-Level States
- `apiKey`: Current Gemini API key status
- `selectedTopic`: Currently selected topic from the playbook
- `selectedLanguage`: Current language selection
- `isLoading`: Loading state for story generation
- `loadingMessage`: Current loading message
- `error`: Any error messages
- `story`: Generated story text
- `p5jsCode`: Generated p5.js animation code
- `citations`: Array of Rigveda citations
- `initialSuggestions`: Initial suggestion questions

### StoryDisplay-Level States
- `messages`: Chat conversation messages
- `suggestions`: Current follow-up suggestions
- `isReplying`: Whether the sage is replying
- `ttsState`: Text-to-speech playback state (id, status)
- `ttsError`: TTS-specific errors
- `playbackRate`: Current audio playback speed
- `audioCacheSize`: Number of cached audio buffers

## Usage

The modal is automatically integrated into both:
1. **App.tsx** - Shows app-level states when browsing topics
2. **StoryDisplay.tsx** - Shows all states including chat and TTS

### Opening the Modal
Click the **"🐛 Debug States"** button in the bottom-right corner.

### Reading the States
- **Color Indicators**:
  - 🟢 Green: Active/Present values
  - 🟡 Yellow: Loading/Processing states
  - 🔴 Red: Errors or missing values
  - ⚪ Gray: Inactive or empty states

- **Type Badges**: Each state shows its JavaScript type (string, number, object, array, boolean)

### Closing the Modal
Click the **"Close"** button in the top-right corner of the modal.

## Implementation Details

The modal uses:
- Native React state management
- Smart value formatting for readability
- Conditional color coding based on state type and value
- Responsive design that works on mobile and desktop

## Development

To modify the tracked states:
1. Edit `TestingModalProps` interface in `components/TestingModal.tsx`
2. Update the states passed from `App.tsx` or `StoryDisplay.tsx`
3. Adjust formatting in `formatValue()` function if needed
4. Modify colors in `getStateColor()` and `getBadgeColor()` functions

## Example States Display

```
apiKey: string
"AIzaSyD..."

selectedTopic: object
{ title: "Agni, The Divine Messenger", keywords: 5 }

ttsState: object
{ id: "sage-1234567", status: "PLAYING" }

messages: Array(3) messages

audioCacheSize: number
15
```

## Best Practices

- Keep the modal open while debugging specific features
- Check `ttsState` when troubleshooting audio playback
- Monitor `messages` array to verify chat flow
- Watch `isLoading` and `loadingMessage` for async operations
- Verify `apiKey` presence before testing API features

## Notes

- The modal only appears in development and can be removed for production
- States update in real-time as the application runs
- Some sensitive data (API keys) are truncated for security
- Large text values (story, code) are previewed with character counts
