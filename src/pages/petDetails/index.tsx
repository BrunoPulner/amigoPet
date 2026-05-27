import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiMessageCircle,
  FiShield,
  FiX,
} from "react-icons/fi";

import {
  getPetDetails,
  type VaccinationCard,
} from "../../services/firestore/getPetDetails";
import type { Pet } from "../../services/firestore/getPets";

function getSpeciesLabel(species: Pet["species"]) {
  return species === "dog" ? "Cão" : "Gato";
}

function getGenderLabel(gender: Pet["gender"]) {
    return gender === "prince" ? "Macho" : "Fêmea";
}

function getSizeLabel(size: Pet["size"]) {
  if (size === "small") return "Pequeno";
  if (size === "medium") return "Médio";
  return "Grande";
}

function getStatusLabel(status: Pet["status"]) {
  if (status === "available") return "Disponível";
  if (status === "in_process") return "Em processo de adoção";
  return "Adotado";
}

export function PetDetails() {
  const { id } = useParams();

  const [pet, setPet] = useState<Pet | null>(null);
  const [vaccinationCard, setVaccinationCard] =
    useState<VaccinationCard | null>(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const petImages = pet?.images ?? [];
  const fullscreenImage = petImages[fullscreenIndex]?.url ?? selectedImage;

  function openFullscreen(index: number) {
    setFullscreenIndex(index);
    setFullscreenOpen(true);
  }

  function closeFullscreen() {
    setFullscreenOpen(false);
  }

  const handlePreviousImage = useCallback(() => {
  if (petImages.length === 0) return;

  setFullscreenIndex((prev) =>
    prev === 0 ? petImages.length - 1 : prev - 1
  );
}, [petImages.length]);

const handleNextImage = useCallback(() => {
  if (petImages.length === 0) return;

  setFullscreenIndex((prev) =>
    prev === petImages.length - 1 ? 0 : prev + 1
  );
}, [petImages.length]);

  useEffect(() => {
    async function loadPet() {
      if (!id) return;

      try {
        setLoading(true);

        const data = await getPetDetails(id);

        setPet(data.pet);
        setVaccinationCard(data.vaccinationCard);
        setSelectedImage(
  data.pet.images?.[0]?.mediumUrl || data.pet.images?.[0]?.url || ""
);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadPet();
  }, [id]);

  useEffect(() => {
  if (!fullscreenOpen) return;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeFullscreen();
    }

    if (event.key === "ArrowLeft") {
      handlePreviousImage();
    }

    if (event.key === "ArrowRight") {
      handleNextImage();
    }
  }

  document.body.style.overflow = "hidden";

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    document.body.style.overflow = "";
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [
  fullscreenOpen,
  handleNextImage,
  handlePreviousImage,
]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#f4eadc] px-6 py-10">
        <section className="mx-auto max-w-7xl">
          <div className="h-[600px] animate-pulse rounded-[2rem] bg-white shadow-xl shadow-emerald-900/5" />
        </section>
      </main>
    );
  }

  if (!pet) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#f4eadc] px-6 py-10">
        <section className="mx-auto max-w-7xl rounded-[2rem] bg-white p-10 text-center shadow-xl shadow-emerald-900/5">
          <h1 className="text-3xl font-black text-emerald-950">
            Pet não encontrado
          </h1>

          <Link
            to="/pets"
            className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-6 py-3 font-black text-white"
          >
            Voltar para pets
          </Link>
        </section>
      </main>
    );
  }

  const selectedImageIndex = petImages.findIndex(
    (image) => image.url === selectedImage
  );

  const whatsappMessage = encodeURIComponent(
    `Olá, tenho interesse em adotar o pet ${pet.name} que vi no site AmigoPet Rebouças.`
  );

  return (
    <>
      <main className="min-h-[calc(100vh-80px)] bg-[#f4eadc] px-6 py-10">
        <section className="mx-auto max-w-7xl">
          <Link
            to="/pets"
            className="animate-text-reveal inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >
            <FiArrowLeft />
            Voltar para pets
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="animate-hero-reveal rounded-[2rem] bg-white p-5 shadow-xl shadow-emerald-900/5">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-zinc-100">
                {selectedImage ? (
                  <button
                    type="button"
                    onClick={() =>
                      openFullscreen(selectedImageIndex >= 0 ? selectedImageIndex : 0)
                    }
                    className="block w-full cursor-zoom-in"
                    aria-label="Abrir imagem em tela cheia"
                  >
                    <img
  src={selectedImage}
  alt={pet.name}
  loading="eager"
  decoding="async"
  className="h-[520px] w-full object-cover"
/>
                  </button>
                ) : (
                  <div className="flex h-[520px] items-center justify-center text-7xl">
                    🐾
                  </div>
                )}

                {pet.featured && (
                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-white shadow-lg">
                    <FiHeart />
                    Destaque
                  </div>
                )}

                <div className="absolute right-5 top-5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-lg">
                  {getStatusLabel(pet.status)}
                </div>
              </div>

              {pet.images && pet.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {pet.images.map((image, index) => (
                    <button
                      key={image.path}
                      type="button"
                      onClick={() => setSelectedImage(image.mediumUrl || image.url)}
                      onDoubleClick={() => openFullscreen(index)}
                      className={`overflow-hidden rounded-2xl border-4 transition ${
                        selectedImage === image.url
                          ? "border-emerald-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
  src={image.thumbnailUrl || image.mediumUrl || image.url}
  alt={image.name}
  loading="lazy"
  decoding="async"
  className="h-28 w-full object-cover"
/>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="animate-hero-reveal delay-hero-2 space-y-6">
              <div className="rounded-[2rem] bg-emerald-800 p-7 text-white shadow-xl shadow-emerald-900/10">
                <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-50">
                  {getSpeciesLabel(pet.species)} para adoção
                </span>

                <h1 className="mt-5 text-5xl font-black leading-tight">
                  {pet.name}
                </h1>

                <p className="mt-4 text-base font-semibold leading-relaxed text-emerald-50/90">
                  {pet.description}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs font-black uppercase text-emerald-100">
                      Sexo
                    </p>
                    <strong className="mt-1 block text-lg">
                      {getGenderLabel(pet.gender)}
                    </strong>
                  </div>

                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs font-black uppercase text-emerald-100">
                      Porte
                    </p>
                    <strong className="mt-1 block text-lg">
                      {getSizeLabel(pet.size)}
                    </strong>
                  </div>

                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs font-black uppercase text-emerald-100">
                      Idade
                    </p>
                    <strong className="mt-1 block text-lg">
                      {pet.age} 
                    </strong>
                  </div>

                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs font-black uppercase text-emerald-100">
                      Castrado
                    </p>
                    <strong className="mt-1 block text-lg">
                      {pet.castrated ? "Sim" : "Não"}
                    </strong>
                  </div>
                </div>

                <a
                  href={`https://wa.me/5500000000000?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-400 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-orange-300"
                >
                  <FiMessageCircle className="text-2xl" />
                  Tenho interesse em adotar
                </a>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5">
                <h2 className="flex items-center gap-3 text-2xl font-black text-emerald-950">
                  <FiCalendar className="text-emerald-600" />
                  Informações de adoção
                </h2>

                <div className="mt-5 space-y-3 text-sm font-semibold text-zinc-600">
                  <p>
                    Status:{" "}
                    <strong className="text-emerald-700">
                      {getStatusLabel(pet.status)}
                    </strong>
                  </p>

                  <p>
                    Esperando desde:{" "}
                    <strong className="text-emerald-700">
                      {pet.waitingSince || "Não informado"}
                    </strong>
                  </p>

                  <p>
                    Carteirinha vinculada:{" "}
                    <strong className="text-emerald-700">
                      {pet.vaccinationCardId ? "Sim" : "Não"}
                    </strong>
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className="animate-hero-reveal delay-hero-3 mt-8 rounded-[2rem] bg-white p-7 shadow-xl shadow-emerald-900/5">
            <h2 className="flex items-center gap-3 text-3xl font-black text-emerald-950">
              <FiShield className="text-emerald-600" />
              Carteirinha de vacinação
            </h2>

            {!vaccinationCard ? (
              <p className="mt-4 text-base font-semibold text-zinc-600">
                Nenhuma carteirinha encontrada para este pet.
              </p>
            ) : (
              <>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl bg-emerald-50 p-5">
                    <p className="text-sm font-black text-emerald-700">
                      Vermifugado
                    </p>
                    <strong className="mt-1 block text-2xl font-black text-emerald-950">
                      {vaccinationCard.dewormed ? "Sim" : "Não"}
                    </strong>
                  </div>

                  <div className="rounded-3xl bg-emerald-50 p-5">
                    <p className="text-sm font-black text-emerald-700">
                      Antipulgas/carrapatos
                    </p>
                    <strong className="mt-1 block text-2xl font-black text-emerald-950">
                      {vaccinationCard.fleaTickTreatment ? "Sim" : "Não"}
                    </strong>
                  </div>

                  <div className="rounded-3xl bg-orange-50 p-5">
                    <p className="text-sm font-black text-orange-600">
                      Vacinas cadastradas
                    </p>
                    <strong className="mt-1 block text-2xl font-black text-orange-600">
                      {vaccinationCard.vaccines?.length ?? 0}
                    </strong>
                  </div>
                </div>

                {vaccinationCard.vaccines?.length > 0 ? (
                  <div className="mt-7 grid gap-5 md:grid-cols-2">
                    {vaccinationCard.vaccines.map((vaccine, index) => (
                      <div
                        key={`${vaccine.name}-${index}`}
                        className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5"
                      >
                        <h3 className="text-xl font-black text-emerald-950">
                          Vacina {index + 1}
                        </h3>

                        <div className="mt-4 space-y-2 text-sm font-semibold text-zinc-600">
  <p>
    Nome:{" "}
    <strong className="text-zinc-800">
      {vaccine.name || "Não informado"}
    </strong>
  </p>

  <p>
    Dose:{" "}
    <strong className="text-zinc-800">
      {vaccine.dose || "Não informada"}
    </strong>
  </p>

  <p>
    Observações:{" "}
    <strong className="text-zinc-800">
      {vaccine.notes || "Nenhuma observação"}
    </strong>
  </p>
</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-3xl bg-zinc-50 p-6 text-center">
                    <FiCheckCircle className="mx-auto text-4xl text-emerald-600" />
                    <p className="mt-3 text-base font-black text-emerald-950">
                      Este pet possui carteirinha cadastrada, mas ainda não
                      possui vacinas registradas.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        </section>
      </main>

      {fullscreenOpen && fullscreenImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 px-4 py-6">
          <button
            type="button"
            onClick={closeFullscreen}
            className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl text-emerald-700 shadow-lg transition hover:scale-105"
            aria-label="Fechar imagem"
          >
            <FiX />
          </button>

          {petImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePreviousImage}
                className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-3xl text-emerald-700 shadow-lg transition hover:scale-105 md:left-6 md:h-14 md:w-14"
                aria-label="Imagem anterior"
              >
                <FiChevronLeft />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-3xl text-emerald-700 shadow-lg transition hover:scale-105 md:right-6 md:h-14 md:w-14"
                aria-label="Próxima imagem"
              >
                <FiChevronRight />
              </button>
            </>
          )}

          <img
            src={fullscreenImage}
            alt={pet.name}
            className="max-h-[88dvh] max-w-[94vw] rounded-2xl object-contain shadow-2xl"
          />

          {petImages.length > 1 && (
            <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-emerald-800 shadow-lg">
              {fullscreenIndex + 1} / {petImages.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}