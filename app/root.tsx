import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import Header from "./components/Header";

import "./tailwind.css";
import "keen-slider/keen-slider.min.css";

export default function App() {
  return (
    <html lang="pt">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="text-midnight">
        <Header />

        <main className="mx-auto px-4">
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
