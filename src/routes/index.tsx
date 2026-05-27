import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";

import { Layout } from "../components/layout";

import { AuthContext } from "../contexts/auth-context";

import { Home } from "../pages/home";
import { Pets } from "../pages/pets";
import { PetDetails } from "../pages/petDetails";
import { AboutAdoption } from "../pages/aboutAdoption";

import { Login } from "../pages/login";

import { ScrollToTop } from "../components/scrollToTop";

import { Admin } from "../pages/admin";
import { NewPet } from "../pages/admin/newPet";
import { EditPet } from "../pages/admin/editPet";
import { Microchips } from "../pages/admin/microchips";

function Private({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signed, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f4eadc]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

          <p className="text-lg font-black text-emerald-900">
            Verificando autenticação...
          </p>
        </div>
      </main>
    );
  }

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />

          <Route path="/pets" element={<Pets />} />

          <Route path="/pets/:id" element={<PetDetails />} />

          <Route
            path="/como-adotar"
            element={<AboutAdoption />}
          />

          <Route path="/login" element={<Login />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <Private>
                <Admin />
              </Private>
            }
          />

          <Route
  path="/admin/microchips"
  element={
    <Private>
      <Microchips />
    </Private>
  }
/>

          <Route
            path="/admin/pets/new"
            element={
              <Private>
                <NewPet />
              </Private>
            }
          />

          <Route
  path="/admin/pets/edit/:collectionName/:id"
  element={
    <Private>
      <EditPet />
    </Private>
  }
/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}