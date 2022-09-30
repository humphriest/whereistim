import "styles/global.css";
import "resources/fonts/fonts.css";

import type { AppProps } from "next/app";
import { DefaultTheme, ThemeProvider } from "styled-components";

function MyApp({ Component, pageProps }: AppProps) {
  const theme: DefaultTheme = {
    colors: {
      primary: "#111",
      secondary: "#0070f3",
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
