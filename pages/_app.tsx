import "../styles/globals.css";
import { ThemeProvider } from "@emotion/react";
import type { AppProps } from "next/app";
import { lightTheme } from "../themes";
import { CssBaseline } from "@mui/material";
import { SWRConfig } from "swr";
import { AuthProvider, CartProvider, UiProvider } from "../context";
import { useState, useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);
  if (!showChild) {
    return <></>;
  }

  return (
    <SWRConfig
      value={{
        //refreshInterval: 3000, //
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <AuthProvider>
        <CartProvider>
          <UiProvider>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </UiProvider>
        </CartProvider>
      </AuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
