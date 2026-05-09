import { FiHeart } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-emerald-700 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-wide text-emerald-50 backdrop-blur">
              <FiHeart className="text-xs" />
              Projeto beneficente
            </span>

            <h2 className="mt-3 text-2xl font-black tracking-tight">
              AmigoPet - Rebouças
            </h2>

            <p className="mt-2 text-sm font-semibold leading-relaxed text-emerald-50/80">
              Plataforma beneficente para apoio à adoção responsável de cães e
              gatos no município de Rebouças - PR.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-[11px] font-black uppercase tracking-wide text-emerald-100">
              Desenvolvido por
            </p>

            <h3 className="mt-1 text-xl font-black text-white">
              Bruno Pulner
            </h3>

            <a
              href="https://dev-pulner.com.br/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-md transition hover:-translate-y-1 hover:bg-emerald-50"
            >
              dev-pulner.com.br
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-4 text-center text-xs font-semibold text-emerald-50/70 md:flex-row md:items-center md:justify-between md:text-left">
          <p>
            © {new Date().getFullYear()} AmigoPet - Rebouças.
          </p>

          <p>Secretaria de Agricultura e Meio Ambiente</p>
        </div>
      </div>
    </footer>
  );
}