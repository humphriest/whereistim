import "styles/global.css";
import "../resources/fonts/fonts.css";
import "components/Map/Map.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
