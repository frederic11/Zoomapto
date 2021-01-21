import React, { useState } from "react";

export const PreferencesContext = React.createContext(() => {
  const [isDarkTheme, setDarkTheme] = useState(false);

  return {
    toggleTheme: () => {
      setDarkTheme(!isDarkTheme);
    },
    isThemeDark: isDarkTheme,
  };
});
