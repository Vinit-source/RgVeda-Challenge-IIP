
const API_KEY_STORAGE_KEY = 'gemini_api_key';
// Helper function to get the API key
export const getApiKey = (): string => {
	// Check for localStorage first, as it's the user-provided override.
	if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
		const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
		if (storedKey && storedKey.trim() !== '') {
			return storedKey;
		}
	}

	// Fallback to environment variable if localStorage key is not present.
	if (process.env.API_KEY) {
		return process.env.API_KEY;
	}
	
	// If neither is available, throw an error.
	throw new Error("API_KEY not found in localStorage or environment variables. Please provide a key.");
};
