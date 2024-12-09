/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_NEWSAPI_KEY: string;
    REACT_APP_GNEWS_KEY: string;
    REACT_APP_NEWSDATA_KEY: string;
    REACT_APP_NEWSAPI_URL: string;
    REACT_APP_GNEWS_URL: string;
    REACT_APP_NEWSDATA_URL: string;
  }
}
