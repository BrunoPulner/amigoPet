/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiLogOut, FiPlus, FiSearch, FiTrash2, FiHash} from "react-icons/fi";

import { AuthContext } from "../../contexts/auth-context";
import { getPets, type Pet } from "../../services/firestore/getPets";
import { deletePet } from "../../services/firestore/deletePet";

import { toast } from "react-toastify";

function getSpeciesLabel(species: Pet["species"]) {
  return species === "dog" ? "Cão" : "Gato";
}

function getStatusLabel(status: Pet["status"]) {
  if (status === "available") return "Disponível";
  if (status === "in_process") return "Em processo";
  return "Adotado";
}

export function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  async function loadPets() {
    try {
      setLoading(true);
      const data = await getPets();
      setPets(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPets();
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  async function handleDeletePet(pet: Pet) {
    toast.warning(
      ({ closeToast }) => (
        <div>
          <strong>Excluir {pet.name}?</strong>

          <p className="mt-2 text-sm">
            Essa ação removerá o pet, imagens e carteirinha.
          </p>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={async () => {
                closeToast?.();

                try {
                  setDeletingId(pet.id);

                  await deletePet(pet);

                  setPets((prev) => prev.filter((item) => item.id !== pet.id));

                  toast.success("Pet excluído com sucesso!");
                } catch (error) {
                  console.log(error);
                  toast.error("Erro ao excluir o pet.");
                } finally {
                  setDeletingId("");
                }
              }}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white"
            >
              Sim, excluir
            </button>

            <button
              type="button"
              onClick={closeToast}
              className="rounded-lg bg-zinc-200 px-3 py-2 text-sm font-bold text-zinc-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  }

  const availablePets = pets.filter((pet) => pet.status === "available").length;
  const adoptedPets = pets.filter((pet) => pet.status === "adopted").length;

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredPets = pets.filter((pet) => {
    const name = pet.name.toLowerCase();
    const trackingCode = pet.trackingCode?.toLowerCase() ?? "";
    const species = getSpeciesLabel(pet.species).toLowerCase();
    const status = getStatusLabel(pet.status).toLowerCase();

    return (
      name.includes(normalizedSearch) ||
      trackingCode.includes(normalizedSearch) ||
      species.includes(normalizedSearch) ||
      status.includes(normalizedSearch)
    );
  });

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f4eadc] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="animate-hero-reveal rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-700">
                Painel administrativo
              </span>

              <h1 className="mt-4 text-4xl font-black text-emerald-950">
                Bem-vindo ao painel do AmigoPet
              </h1>

              <p className="mt-3 text-lg font-semibold text-zinc-600">
                Usuário autenticado:
              </p>

              <p className="mt-1 text-base font-black text-emerald-700">
                {user?.email}
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
  <Link
    to="/admin/pets/new"
    className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-1 hover:bg-emerald-500 sm:text-base"
  >
    <FiPlus className="shrink-0 text-lg" />
    <span className="whitespace-nowrap">
      Cadastrar novo pet
    </span>
  </Link>

  <Link
    to="/admin/microchips"
    className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-emerald-100 px-6 py-3 text-sm font-extrabold text-emerald-800 shadow-lg shadow-emerald-900/10 transition hover:-translate-y-1 hover:bg-emerald-200 sm:text-base"
  >
    <FiHash className="shrink-0 text-lg" />

    <span className="whitespace-nowrap">
      Visualizar micro-chips
    </span>
  </Link>

  <button
    type="button"
    onClick={handleLogout}
    className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-1 hover:bg-red-400 sm:text-base"
  >
    <FiLogOut className="shrink-0 text-lg" />

    <span className="whitespace-nowrap">
      Sair da conta
    </span>
  </button>
</div>
          </div>
        </div>

        <div className="animate-hero-reveal delay-hero-2 mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] bg-emerald-700 p-6 text-white shadow-xl shadow-emerald-900/10">
            <p className="text-sm font-black uppercase text-emerald-100">
              Total de pets
            </p>
            <strong className="mt-2 block text-4xl font-black">
              {pets.length}
            </strong>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5">
            <p className="text-sm font-black uppercase text-emerald-700">
              Disponíveis
            </p>
            <strong className="mt-2 block text-4xl font-black text-emerald-950">
              {availablePets}
            </strong>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5">
            <p className="text-sm font-black uppercase text-orange-500">
              Adotados
            </p>
            <strong className="mt-2 block text-4xl font-black text-emerald-950">
              {adoptedPets}
            </strong>
          </div>
        </div>

        <section className="animate-hero-reveal delay-hero-3 mt-8 rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black text-emerald-950">
                Pets cadastrados
              </h2>

              <p className="mt-1 text-sm font-semibold text-zinc-500">
                Gerencie os pets disponíveis no site.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex h-14 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white">
              <FiSearch className="text-xl text-emerald-700" />

              <input
                type="text"
                placeholder="Buscar por nome, código de rastreio, espécie ou status..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-full flex-1 bg-transparent text-base font-semibold text-zinc-800 outline-none placeholder:text-zinc-400"
              />
            </div>

            <p className="mt-2 text-xs font-semibold text-zinc-500">
              O código de rastreio é uma informação interna e aparece somente no
              painel administrativo.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-[2rem] bg-zinc-100"
                />
              ))}
            </div>
          ) : filteredPets.length === 0 ? (
            <div className="rounded-[2rem] bg-zinc-50 p-10 text-center">
              <h3 className="text-2xl font-black text-emerald-950">
                {pets.length === 0
                  ? "Nenhum pet cadastrado ainda"
                  : "Nenhum pet encontrado"}
              </h3>

              <p className="mt-2 text-sm font-semibold text-zinc-500">
                {pets.length === 0
                  ? "Clique em cadastrar novo pet para iniciar."
                  : "Tente buscar por outro nome ou código de rastreio."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredPets.map((pet, index) => {
                const sortedImages = [...(pet.images ?? [])].sort(
  (a, b) => (a.order ?? 999) - (b.order ?? 999)
);

const mainImage =
  sortedImages[0]?.thumbnailUrl ||
  sortedImages[0]?.mediumUrl ||
  sortedImages[0]?.url;

                return (
                  <div
                    key={`${pet.collectionName}-${pet.id}`}
                    style={{
                      animationDelay: `${0.15 + index * 0.08}s`,
                    }}
                    className="animate-text-reveal overflow-hidden rounded-[2rem] border border-zinc-100 bg-white shadow-lg shadow-emerald-900/5"
                  >
                    <div className="relative h-56 bg-zinc-100">
                      {mainImage ? (
                        <img
  src={mainImage}
  alt={pet.name}
  loading="lazy"
  decoding="async"
  fetchPriority="low"
  className="h-full w-full object-cover"
/>
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">
                          🐾
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-emerald-700 shadow">
                        {getSpeciesLabel(pet.species)}
                      </span>

                      <span className="absolute right-4 top-4 rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow">
                        {getStatusLabel(pet.status)}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-2xl font-black text-emerald-950">
                        {pet.name}
                      </h3>

                      {pet.trackingCode && (
                        <p className="mt-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                          Código: {pet.trackingCode}
                        </p>
                      )}

                      <p className="mt-2 line-clamp-2 text-sm font-semibold leading-relaxed text-zinc-600">
                        {pet.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
                          {pet.age} 
                        </span>

                        <span className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-black text-zinc-700">
                          {pet.castrated ? "Castrado" : "Não castrado"}
                        </span>

                        {pet.featured && (
                          <span className="rounded-full bg-orange-100 px-3 py-2 text-xs font-black text-orange-600">
                            Destaque
                          </span>
                        )}
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <Link
                          to={`/admin/pets/edit/${pet.collectionName}/${pet.id}`}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-black text-white transition hover:bg-emerald-500"
                        >
                          <FiEdit />
                          Editar
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeletePet(pet)}
                          disabled={deletingId === pet.id}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-red-500 text-sm font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <FiTrash2 />
                          {deletingId === pet.id ? "Excluindo..." : "Excluir"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}