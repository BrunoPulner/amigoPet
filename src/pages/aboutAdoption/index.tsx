import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiClipboard,
  FiHeart,
  FiMessageCircle,
  FiSearch,
  FiUsers,
} from "react-icons/fi";

const adoptionSteps = [
  {
    number: "01",
    icon: FiSearch,
    title: "Escolha um pet pelo site",
    description:
      "Acesse a lista de pets disponíveis, veja as fotos, leia a descrição e conheça as informações principais do animal.",
  },
  {
    number: "02",
    icon: FiMessageCircle,
    title: "Converse com a Secretaria",
    description:
      "Ao encontrar um pet de interesse, entre em contato pelo WhatsApp com a equipe responsável pela adoção.",
  },
  {
    number: "03",
    icon: FiUsers,
    title: "Combine um possível encontro",
    description:
      "A equipe orientará sobre os próximos passos e poderá combinar um encontro para você conhecer melhor o pet.",
  },
  {
    number: "04",
    icon: FiClipboard,
    title: "Assine o termo de adoção",
    description:
      "Se houver certeza e responsabilidade na decisão, será necessário assinar o termo de adoção na Secretaria.",
  },
  {
    number: "05",
    icon: FiHeart,
    title: "Leve seu novo amigo para casa",
    description:
      "Após a conclusão das etapas, o pet poderá seguir para seu novo lar com cuidado, carinho e proteção.",
  },
];

export function AboutAdoption() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f4eadc] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="animate-hero-reveal relative overflow-hidden rounded-[2rem] bg-emerald-800 px-5 py-8 text-white shadow-xl shadow-emerald-900/10 sm:px-8 md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-50 backdrop-blur">
                 Adoção responsável
              </span>

              <h1 className="mt-5 max-w-3xl break-words text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
  Adotar é um compromisso de amor e responsabilidade.
</h1>

             <p className="mt-4 max-w-2xl text-sm font-semibold leading-relaxed text-emerald-50/90 sm:text-base">
                Antes de levar um pet para casa, é importante conhecer o animal,
                conversar com a equipe responsável e entender os cuidados
                necessários para oferecer um lar seguro e definitivo.
              </p>

              <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row">
                <Link
                  to="/pets"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-black text-emerald-800 shadow-lg transition hover:-translate-y-1 hover:bg-emerald-50"
                >
                  Ver pets disponíveis
                </Link>

                <a
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-orange-400 px-7 py-4 text-base font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-orange-300"
                >
                  Falar com responsável
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/10 p-6 backdrop-blur">
              <h2 className="text-2xl font-black text-white">
                O processo é simples
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 text-2xl text-orange-300" />
                  <p className="text-sm font-semibold leading-relaxed text-emerald-50">
                    A adoção é gratuita, mas exige responsabilidade.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 text-2xl text-orange-300" />
                  <p className="text-sm font-semibold leading-relaxed text-emerald-50">
                    O interessado deve conversar com a equipe da Secretaria.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 text-2xl text-orange-300" />
                  <p className="text-sm font-semibold leading-relaxed text-emerald-50">
                    A retirada do pet ocorre somente após orientação e termo de
                    adoção.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <div className="animate-text-reveal delay-hero-2 text-center">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-700">
              Passo a passo
            </span>

            <h2 className="mt-4 text-4xl font-black text-emerald-950">
              Como funciona a adoção?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-relaxed text-zinc-600">
              Cada etapa ajuda a garantir que o pet seja adotado com segurança,
              cuidado e consciência.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {adoptionSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  style={{
                    animationDelay: `${0.3 + index * 0.1}s`,
                  }}
                  className="animate-text-reveal rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
                      <Icon />
                    </div>

                    <span className="text-4xl font-black text-emerald-100">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black text-emerald-950">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="animate-hero-reveal delay-hero-4 mt-8 rounded-[2rem] bg-white p-8 shadow-xl shadow-emerald-900/5 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-orange-600">
                Antes de adotar
              </span>

              <h2 className="mt-4 text-4xl font-black text-emerald-950">
                Tenha certeza da decisão.
              </h2>

              <p className="mt-4 text-base font-semibold leading-relaxed text-zinc-600">
                Um pet precisa de tempo, cuidado, alimentação, espaço, carinho e
                acompanhamento. A adoção deve ser uma decisão definitiva e
                responsável.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-emerald-50 p-5">
                <h3 className="text-lg font-black text-emerald-800">
                  Cuidado diário
                </h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600">
                  O animal precisa de alimentação, água, abrigo, higiene e
                  atenção todos os dias.
                </p>
              </div>

              <div className="rounded-3xl bg-orange-50 p-5">
                <h3 className="text-lg font-black text-orange-600">
                  Responsabilidade
                </h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600">
                  A adoção não deve ser impulsiva. É um compromisso para toda a
                  vida do pet.
                </p>
              </div>

              <div className="rounded-3xl bg-zinc-50 p-5">
                <h3 className="text-lg font-black text-zinc-800">
                  Ambiente seguro
                </h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600">
                  Verifique se sua casa possui espaço e segurança para receber o
                  novo amigo.
                </p>
              </div>

              <div className="rounded-3xl bg-emerald-50 p-5">
                <h3 className="text-lg font-black text-emerald-800">
                  Amor e paciência
                </h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600">
                  Muitos pets precisam de adaptação. Tenha paciência e acolha
                  com carinho.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}