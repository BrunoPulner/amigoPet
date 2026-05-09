import { Outlet } from "react-router-dom";

import { Header } from "../header";
import { Footer } from "../footer";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}