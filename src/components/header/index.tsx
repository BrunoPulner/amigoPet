import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

import { AuthContext } from "../../contexts/auth-context";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const { signed, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(path: string) {
    return location.pathname === path;
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleMobileNavigate(path: string) {
    setMenuOpen(false);

    setTimeout(() => {
      navigate(path);
    }, 520);
  }

  async function handleMobileLogout() {
    setMenuOpen(false);

    setTimeout(async () => {
      await logout();
      navigate("/");
    }, 520);
  }

  const menuItems = [
    { label: "Início", path: "/" },
    { label: "Pets para adoção", path: "/pets" },
    { label: "Como adotar", path: "/como-adotar" },
  ];

  const linkClass = (path: string) =>
    `inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl px-4 text-sm font-bold transition ${
      isActive(path)
        ? "bg-white text-emerald-700 shadow-md"
        : "text-white hover:bg-white/10"
    }`;

  const mobileLinkClass = (path: string) =>
    `flex h-16 w-full max-w-sm items-center justify-center rounded-2xl text-center text-2xl font-black transition ${
      isActive(path)
        ? "bg-white text-emerald-700 shadow-xl"
        : "bg-white/10 text-white backdrop-blur hover:bg-white/20"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-emerald-700/95 text-white shadow-lg backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3 transition hover:opacity-90"
        >
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tight">
              AmigoPet
            </span>

            <span className="text-xs font-medium text-emerald-100">
              Rebouças - PR
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 text-sm font-semibold lg:flex">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={linkClass(item.path)}>
              {item.label}
            </Link>
          ))}

          <Link
  to="/login"
  className="ml-2 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-emerald-50/80 transition hover:bg-white/10 hover:text-white"
>
  Administrador
</Link>

          {signed && (
            <button
              type="button"
              onClick={logout}
              className="ml-2 inline-flex h-12 items-center justify-center whitespace-nowrap rounded-xl bg-red-500 px-6 text-base font-black text-white shadow-md transition hover:scale-105 hover:bg-red-400"
            >
              Sair
            </button>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-3xl text-white transition hover:bg-white/20 lg:hidden"
          aria-label="Abrir menu"
        >
          <FiMenu />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[999] flex min-h-screen flex-col overflow-hidden bg-emerald-800 px-6 py-6 text-white lg:hidden"
            initial={{
              clipPath: "circle(0% at calc(100% - 46px) 40px)",
            }}
            animate={{
              clipPath: "circle(150% at calc(100% - 46px) 40px)",
            }}
            exit={{
              clipPath: "circle(0% at calc(100% - 46px) 40px)",
            }}
            transition={{
              duration: 0.55,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <motion.div
              className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.45 }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleMobileNavigate("/")}
                className="flex flex-col leading-none text-left"
              >
                <span className="text-2xl font-black tracking-tight">
                  AmigoPet
                </span>

                <span className="text-xs font-medium text-emerald-100">
                  Rebouças - PR
                </span>
              </button>

              <button
                type="button"
                onClick={closeMenu}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-3xl text-emerald-700 shadow-md"
                aria-label="Fechar menu"
              >
                <FiX />
              </button>
            </div>

            <motion.nav
              className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    delayChildren: 0.35,
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {menuItems.map((item) => (
                <motion.div
                  key={item.path}
                  className="w-full"
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 28,
                      scale: 0.96,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.28,
                        ease: "easeOut",
                      },
                    },
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleMobileNavigate(item.path)}
                    className={mobileLinkClass(item.path)}
                  >
                    {item.label}
                  </button>
                </motion.div>
              ))}

              <motion.div
                className="mt-8 w-full border-t border-white/15 pt-8"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 28,
                    scale: 0.96,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.28,
                      ease: "easeOut",
                    },
                  },
                }}
              >
                 <button
    type="button"
    onClick={() => handleMobileNavigate("/login")}
    className="flex h-14 w-full max-w-sm items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-center text-lg font-black text-emerald-50 backdrop-blur transition hover:bg-white/20"
  >
    Área administrativa
  </button>

   <p className="mx-auto mt-3 max-w-sm text-center text-xs font-semibold text-emerald-100/80">
    Acesso restrito para usuários autorizados.
  </p>
              </motion.div>

              {signed && (
                <motion.div
                  className="w-full"
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 28,
                      scale: 0.96,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.28,
                        ease: "easeOut",
                      },
                    },
                  }}
                >
                  <button
                    type="button"
                    onClick={handleMobileLogout}
                    className="flex h-16 w-full max-w-sm items-center justify-center rounded-2xl bg-red-500 text-center text-2xl font-black text-white shadow-xl transition hover:bg-red-400"
                  >
                    Sair
                  </button>
                </motion.div>
              )}
            </motion.nav>

            <motion.p
              className="relative z-10 pb-4 text-center text-sm font-medium text-emerald-100"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.25 }}
            >
              Projeto beneficente de adoção responsável
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}