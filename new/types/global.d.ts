declare global {
  interface Window {
    mockDB: {
      databaseName: string;
    };
  }
}

export {};
