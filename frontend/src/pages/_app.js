import Head from "next/head";
import "@/styles/globals.css";
import "@/styles/paymentslip.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "antd/dist/reset.css";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "../themes/theme";
import { wrapper } from "../store";
import { setUser } from "../store/slices/auth/user/userAuthSlice";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import ErrorBoundary from "../components/ErrorBoundary";

function InnerApp({ Component, pageProps }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        try {
          const { user, token } = JSON.parse(userData);
          dispatch(setUser({ user, token }));
        } catch {
          sessionStorage.removeItem('userData');
        }
      }
    }
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>TCAC&apos;25</title>
        <meta name="description" content="TCAC'26 - TIMSAN Camp and Conference" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/timsan-logo.png" />
      </Head>
      <ChakraProvider theme={theme}>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </ChakraProvider>
    </>
  );
}

function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  return (
    <Provider store={store}>
      <InnerApp Component={Component} pageProps={pageProps} />
    </Provider>
  );
}

export default App;
