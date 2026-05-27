import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useContext } from "react";

import { Layout } from "../components/layout";
import { AuthContext } from "../contexts/auth-context";
import { ScrollToTop } from "../components/scrollToTop";

import { RouteLoading } from "../components/routeLoading";

const Home = lazy(() =>
  import("../pages/home").then((module) => ({ default: module.Home }))
);

const Pets = lazy(() =>
  import("../pages/pets").then((module) => ({ default: module.Pets }))
);

const PetDetails = lazy(() =>
  import("../pages/petDetails").then((module) => ({
    default: module.PetDetails,
  }))
);

const AboutAdoption = lazy(() =>
  import("../pages/aboutAdoption").then((module) => ({
    default: module.AboutAdoption,
  }))
);

const Login = lazy(() =>
  import("../pages/login").then((module) => ({ default: module.Login }))
);

const Admin = lazy(() =>
  import("../pages/admin").then((module) => ({ default: module.Admin }))
);

const NewPet = lazy(() =>
  import("../pages/admin/newPet").then((module) => ({
    default: module.NewPet,
  }))
);

const EditPet = lazy(() =>
  import("../pages/admin/editPet").then((module) => ({
    default: module.EditPet,
  }))
);

const Microchips = lazy(() =>
  import("../pages/admin/microchips").then((module) => ({
    default: module.Microchips,
  }))
);

function PageLoading() {
  return (
    <main className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#f4eadc]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

        <p className="text-lg font-black text-emerald-900">
          Carregando página...
        </p>
      </div>
    </main>
  );
}

function Private({ children }: { children: React.ReactNode }) {
  const { signed, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) {
  return (
    <main className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#f4eadc]">
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
       <RouteLoading />

      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<Layout />}>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />

            <Route path="/pets" element={<Pets />} />

            <Route path="/pets/:id" element={<PetDetails />} />

            <Route path="/como-adotar" element={<AboutAdoption />} />

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
      </Suspense>
    </BrowserRouter>
  );
}