import { Link } from "react-router-dom";
import {
  FiExternalLink,
  FiHeart,
  FiHome,
  FiInfo,
  FiShield,
} from "react-icons/fi";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-emerald-800 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          {/* PROJETO */}
          <div>
            <img
              src="/logo-gif-att-semfundo.png"
              alt="Projeto AmigoPet"
              className="h-20 w-auto object-contain"
            />

            

            <h2 className="mt-4 text-3xl font-black tracking-tight">
              Projeto AmigoPet
            </h2>

            <p className="mt-4 max-w-md text-sm font-semibold leading-relaxed text-emerald-50/80">
              Plataforma beneficente desenvolvida para incentivar a adoção
              responsável de cães e gatos no município de Rebouças - PR.
            </p>

            <p className="mt-4 text-sm font-black text-orange-300">
              Adoção responsável transforma vidas. 🐾
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-lg font-black text-white">
              Navegação
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-3 text-sm font-semibold text-emerald-50/80 transition hover:text-white"
              >
                <FiHome />
                Início
              </Link>

              <Link
                to="/pets"
                className="inline-flex items-center gap-3 text-sm font-semibold text-emerald-50/80 transition hover:text-white"
              >
                <FiHeart />
                Pets para adoção
              </Link>

              <Link
                to="/como-adotar"
                className="inline-flex items-center gap-3 text-sm font-semibold text-emerald-50/80 transition hover:text-white"
              >
                <FiInfo />
                Como adotar
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-3 text-sm font-semibold text-emerald-50/80 transition hover:text-white"
              >
                <FiShield />
                Área administrativa
              </Link>
            </div>
          </div>

          {/* SECRETARIA */}
          <div>
            <h3 className="text-lg font-black text-white">
              Secretaria Parceira
            </h3>

            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold leading-relaxed text-emerald-50/80">
                Secretaria de Agricultura e Meio Ambiente de Rebouças - PR.
              </p>

              <div className="mt-4 h-px w-full bg-white/10" />

              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-emerald-100">
                Projeto institucional
              </p>
            </div>
          </div>

          {/* DESENVOLVEDOR */}
          <div>
            <h3 className="text-lg font-black text-white">
              Desenvolvimento
            </h3>

            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-[11px] font-black uppercase tracking-wide text-emerald-100">
                Desenvolvido por
              </p>

              <h4 className="mt-2 text-2xl font-black">
                Bruno Pulner
              </h4>

              <p className="mt-3 text-sm font-semibold leading-relaxed text-emerald-50/80">
                Desenvolvimento full stack, sistemas web modernos e plataformas
                profissionais.
              </p>

              <a
                href="https://dev-pulner.com.br/"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-emerald-700 shadow-lg transition hover:-translate-y-1 hover:bg-emerald-50"
              >
                dev-pulner.com.br
                <FiExternalLink />
              </a>
            </div>
          </div>
        </div>

        {/* LINHA FINAL */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-center text-xs font-semibold text-emerald-50/70 md:flex-row md:items-center md:justify-between md:text-left">
          <p>
            © {new Date().getFullYear()} Projeto AmigoPet - Rebouças.
          </p>

          <p>
            Plataforma beneficente de adoção responsável.
          </p>
        </div>
      </div>
    </footer>
  );
}