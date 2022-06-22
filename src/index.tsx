import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { DiffPage } from "./Pages/DiffPage";
import { ThemeProvider, useTheme } from "styled-components";
import { CustomThemeType, darkTheme } from "./design/theme";
import { WAPage } from "./Pages/WAPage";

const queryClient = new QueryClient();

function Layout() {
  const theme: CustomThemeType = useTheme() as CustomThemeType;
  return (
    <div
      style={{
        backgroundColor: theme.Root.backgroundColor,
        padding: 12,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        color: theme.Default.color,
      }}
    >
      <div className="text-gray-500 text-lg -ml-2 -mt-3">
        ~/wow/stats/data/vis
      </div>
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <footer style={{ color: theme.Footer.color }}>
        <a
          rel="noreferrer"
          target="_blank"
          href="https://www.patreon.com/armsperson"
        >
          patreon.com/armsperson
        </a>
      </footer>
    </div>
  );
}

function CookieThemeMiddle() {
  return (
    <ThemeProvider theme={darkTheme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DiffPage />} />
              <Route path="WA" element={<WAPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <CookieThemeMiddle />
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
