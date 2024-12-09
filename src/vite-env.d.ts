/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEWSAPI_KEY: string;
  readonly VITE_GNEWS_KEY: string;
  readonly VITE_NEWSDATA_KEY: string;
  readonly VITE_NEWSAPI_URL: string;
  readonly VITE_GNEWS_URL: string;
  readonly VITE_NEWSDATA_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
