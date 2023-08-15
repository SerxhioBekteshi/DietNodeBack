declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      JWT_COOKIE_EXPIRES_IN: number;
      PORT?: string;
      WEBPAGE_URL: string;
      DOTENV_CONFIG_PATH: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { };
