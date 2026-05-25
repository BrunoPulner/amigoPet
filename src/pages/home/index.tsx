import { Link } from "react-router-dom";

export function Home() {
  return (
    <main className="flex flex-col">
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#e9e2d7]">
        <img
          src="/banner-home.svg"
          alt="Campanha de adoção de animais em Rebouças"
          className="absolute inset-0 h-full w-full animate-hero-reveal object-cover object-center md:object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#f4eadc] via-[#f4eadc]/85 to-transparent md:hidden" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1600px] items-center px-6 py-16 sm:px-10 lg:px-16">
          <div className="w-full max-w-3xl text-left">
            <span className="animate-text-reveal delay-hero-1 inline-flex max-w-full rounded-full bg-emerald-700 px-5 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-emerald-900/20 sm:text-sm">
              Projeto beneficente de adoção responsável
            </span>

            <h1 className="animate-text-reveal delay-hero-2 mt-6 max-w-5xl text-4xl font-black leading-[0.98] tracking-[-0.03em] text-emerald-950 sm:text-5xl lg:text-[4.8rem]">
              Um novo lar{" "}
              <span className="font-serif italic text-orange-500">
                começa
              </span>
              <br />
              com uma{" "}
              <span className="font-serif italic text-emerald-600">
                chance.
              </span>
            </h1>

            <p className="animate-text-reveal delay-hero-3 mt-6 max-w-xl text-lg font-semibold leading-relaxed text-zinc-800 sm:text-xl">
              Conheça os animais disponíveis para adoção em Rebouças e ajude um
              amigo de quatro patas a encontrar cuidado, carinho e proteção.
            </p>

            <div className="animate-hero-reveal delay-hero-4 mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/pets"
                className="group inline-flex animate-pulseSoft items-center justify-center rounded-2xl bg-emerald-600 px-8 py-4 text-center text-lg font-black text-white shadow-xl shadow-emerald-900/20 transition hover:-translate-y-1 hover:bg-emerald-500"
              >
                Ver pets disponíveis
                <span className="ml-2 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/como-adotar"
                className="inline-flex items-center justify-center rounded-2xl border border-emerald-800/20 bg-white/80 px-8 py-4 text-center text-lg font-black text-emerald-900 shadow-lg shadow-zinc-900/5 backdrop-blur transition hover:-translate-y-1 hover:bg-white"
              >
                Entenda como adotar
              </Link>
            </div>

            <div className="animate-hero-reveal delay-hero-5 mt-8 flex max-w-xl flex-wrap gap-3">
              <span className="rounded-full bg-white/85 px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm backdrop-blur">
                 Adoção gratuita
              </span>

              <span className="rounded-full bg-white/85 px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm backdrop-blur">
                 Projeto beneficente
              </span>

              <span className="rounded-full bg-white/85 px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm backdrop-blur">
                Secretaria de Agricultura e Meio Ambiente
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}