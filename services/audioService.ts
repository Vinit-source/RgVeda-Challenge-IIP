// services/audioService.ts

// Create a single audio element instance to be reused.
let audio: HTMLAudioElement | null = null;

const getAudioElement = (): HTMLAudioElement => {
    if (!audio) {
        // Using the Audio constructor is the programmatic equivalent of an <audio> tag.
        audio = new Audio('https://www.india-instruments.com/files/audio/tanpura/bhajani_veena.mp3'); // Placeholder for the audio file
        audio.loop = true;
        audio.volume = 0.5; // Louder volume (0.0 to 1.0 is the range)
    }
    return audio;
};

export const audioService = {
  play: async () => {
    try {
        const audioElement = getAudioElement();
        // The play() method returns a Promise which can be rejected if autoplay is blocked by the browser.
        if (audioElement.paused) {
            await audioElement.play();
        }
    } catch (e) {
        // Log a warning instead of a hard error, as background audio is a non-critical feature.
        // This often happens if the user hasn't interacted with the page yet.
        console.warn("Could not play background audio automatically. User interaction might be required.", e);
    }
  },

  stop: () => {
     // We only need to interact with the element if it has been created.
     if (audio) {
         audio.pause();
         audio.currentTime = 0; // Reset for next play
     }
  }
};
