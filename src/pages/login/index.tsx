import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";

import { AuthContext } from "../../contexts/auth-context";

export function Login() {
  const navigate = useNavigate();
  const { signIn, signed, loadingAuth } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loadingAuth && signed) {
      navigate("/admin");
    }
  }, [loadingAuth, signed, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Preencha e-mail e senha para continuar.");
      setErrorMessage("Preencha e-mail e senha para continuar.");
      
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await signIn(email, password);

      toast.success("Login realizado com sucesso!");

      navigate("/admin");
    } catch (error) {
      console.log(error);
      setErrorMessage("E-mail ou senha inválidos.");
      toast.error("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-50 via-[#f4eadc] to-orange-50 px-6 py-16">
      <section className="mx-auto grid min-h-[calc(100vh-180px)] max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <span className="inline-flex rounded-full bg-emerald-700 px-5 py-2 text-sm font-black uppercase tracking-wide text-white shadow-lg">
            Área administrativa
          </span>

          <h1 className="mt-6 text-5xl font-black leading-tight text-emerald-950">
            Gerencie os pets disponíveis para adoção.
          </h1>

          <p className="mt-5 max-w-xl text-lg font-semibold leading-relaxed text-zinc-700">
            Acesse com a conta autorizada para cadastrar animais, atualizar
            informações e marcar pets como adotados.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="mx-auto w-full max-w-md rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-emerald-900/10 backdrop-blur"
        >
          <div className="text-center">
            <img
              src="/logo-reboucas.png"
              alt="Prefeitura Municipal de Rebouças"
              className="mx-auto h-16 w-auto object-contain"
            />

            

            <h2 className="mt-5 text-3xl font-black text-emerald-950">
              Informe suas credenciais
            </h2>

            <p className="mt-2 text-sm font-semibold text-zinc-500">
              AmigoPet - Rebouças
            </p>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-600">
              {errorMessage}
            </div>
          )}

          <div className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-zinc-700">
                E-mail
              </span>

              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 focus-within:border-emerald-500">
                <FiMail className="text-xl text-emerald-600" />

                <input
                  type="email"
                  placeholder="admin@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-base font-semibold text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-zinc-700">
                Senha
              </span>

              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 focus-within:border-emerald-500">
                <FiLock className="text-xl text-emerald-600" />

                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-base font-semibold text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || loadingAuth}
            className="mt-7 flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-6 py-4 text-lg font-black text-white shadow-xl shadow-emerald-900/20 transition hover:-translate-y-1 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar no painel"}
          </button>

          <p className="mt-5 text-center text-xs font-semibold text-zinc-500">
            Acesso restrito à Secretaria responsável.
          </p>
        </form>
      </section>
    </main>
  );
}