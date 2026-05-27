import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export function RouteLoading() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const startTimer = setTimeout(() => {
      setLoading(true);
    }, 0);

    const endTimer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [location.pathname]);

  if (!loading) {
    return null;
  }

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