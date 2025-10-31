/// <reference types="vite/client" />

interface ImportMetaEnv {
	VITE_API_URL: string;
	VITE_API_KEY: string;
	VITE_PUBLIC_SUPABASE_URL: string;
	VITE_PUBLIC_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
