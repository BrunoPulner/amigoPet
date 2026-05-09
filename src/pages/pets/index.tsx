import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiSearch } from "react-icons/fi";

import { getPets, type Pet } from "../../services/firestore/getPets";

type SpeciesFilter = "all" | "dog" | "cat";
type SizeFilter = "all" | "small" | "medium" | "large";
type GenderFilter = "all" | "prince" | "princess";
type CastratedFilter = "all" | "yes" | "no";

function getSpeciesLabel(species: Pet["species"]) {
  return species === "dog" ? "Cão" : "Gato";
}

function getGenderLabel(gender: Pet["gender"]) {
  return gender === "prince" ? "Príncipe" : "Princesa";
}

function getSizeLabel(size: Pet["size"]) {
  if (size === "small") return "Pequeno";
  if (size === "medium") return "Médio";
  return "Grande";
}

function getStatusLabel(status: Pet["status"]) {
  if (status === "available") return "Disponível";
  if (status === "in_process") return "Em processo";
  return "Adotado";
}

export function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const [speciesFilter, setSpeciesFilter] = useState<SpeciesFilter>("all");
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>("all");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [castratedFilter, setCastratedFilter] =
    useState<CastratedFilter>("all");

  useEffect(() => {
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

    loadPets();
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchSpecies =
        speciesFilter === "all" || pet.species === speciesFilter;

      const matchSize = sizeFilter === "all" || pet.size === sizeFilter;

      const matchGender =
        genderFilter === "all" || pet.gender === genderFilter;

      const matchCastrated =
        castratedFilter === "all" ||
        (castratedFilter === "yes" && pet.castrated) ||
        (castratedFilter === "no" && !pet.castrated);

      return matchSpecies && matchSize && matchGender && matchCastrated;
    });
  }, [pets, speciesFilter, sizeFilter, genderFilter, castratedFilter]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f4eadc] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="animate-hero-reveal relative overflow-hidden rounded-[2rem] bg-emerald-800 p-8 text-white shadow-xl shadow-emerald-900/10 md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-50 backdrop-blur">
                🐾 Adoção responsável
              </span>

              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
                Encontre um amigo esperando por você.
              </h1>

              <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-emerald-50/90">
                Conheça os cães e gatos cadastrados pela Secretaria de
                Agricultura e Meio Ambiente de Rebouças e ajude um pet a ganhar
                um lar com amor, cuidado e proteção.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="rounded-3xl bg-white px-6 py-5 text-emerald-800 shadow-lg">
                <p className="text-sm font-black">Encontrados</p>
                <strong className="text-4xl font-black">
                  {filteredPets.length}
                </strong>
              </div>

              <div className="rounded-3xl bg-orange-400 px-6 py-5 text-white shadow-lg">
                <p className="text-sm font-black">Aguardando</p>
                <strong className="text-4xl font-black">
                  {
                    filteredPets.filter((pet) => pet.status === "available")
                      .length
                  }
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-hero-reveal delay-hero-2 mt-8 rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <FiSearch className="text-xl" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-emerald-950">
                Filtrar pets
              </h2>

              <p className="text-sm font-semibold text-zinc-500">
                Encontre um pet compatível com seu lar.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-zinc-700">
                Espécie
              </span>

              <select
                value={speciesFilter}
                onChange={(e) =>
                  setSpeciesFilter(e.target.value as SpeciesFilter)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-black text-zinc-700 outline-none transition focus:border-emerald-500 focus:bg-white"
              >
                <option value="all">Todos</option>
                <option value="dog">Cães</option>
                <option value="cat">Gatos</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-zinc-700">
                Porte
              </span>

              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value as SizeFilter)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-black text-zinc-700 outline-none transition focus:border-emerald-500 focus:bg-white"
              >
                <option value="all">Todos</option>
                <option value="small">Pequeno</option>
                <option value="medium">Médio</option>
                <option value="large">Grande</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-zinc-700">
                Sexo
              </span>

              <select
                value={genderFilter}
                onChange={(e) =>
                  setGenderFilter(e.target.value as GenderFilter)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-black text-zinc-700 outline-none transition focus:border-emerald-500 focus:bg-white"
              >
                <option value="all">Todos</option>
                <option value="prince">Príncipe</option>
                <option value="princess">Princesa</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-zinc-700">
                Castrado
              </span>

              <select
                value={castratedFilter}
                onChange={(e) =>
                  setCastratedFilter(e.target.value as CastratedFilter)
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-black text-zinc-700 outline-none transition focus:border-emerald-500 focus:bg-white"
              >
                <option value="all">Todos</option>
                <option value="yes">Sim</option>
                <option value="no">Não</option>
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="animate-hero-reveal delay-hero-3 mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-[2rem] bg-white shadow-xl shadow-emerald-900/5"
              />
            ))}
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="animate-hero-reveal delay-hero-3 mt-8 rounded-[2rem] bg-white p-10 text-center shadow-xl shadow-emerald-900/5">
            <h2 className="text-3xl font-black text-emerald-950">
              Nenhum pet encontrado
            </h2>

            <p className="mt-3 text-base font-semibold text-zinc-600">
              Tente alterar os filtros para encontrar outros pets disponíveis.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPets.map((pet, index) => {
              const mainImage = pet.images?.[0]?.url;

              return (
                <Link
                  key={`${pet.collectionName}-${pet.id}`}
                  to={`/pets/${pet.collectionName}-${pet.id}`}
                  style={{
                    animationDelay: `${0.15 + index * 0.08}s`,
                  }}
                  className="group animate-text-reveal overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-emerald-900/5 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-72 overflow-hidden bg-zinc-100">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={pet.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl">
                        🐾
                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-emerald-700 shadow">
                      {getSpeciesLabel(pet.species)}
                    </div>

                    <div className="absolute right-4 top-4 rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow">
                      {getStatusLabel(pet.status)}
                    </div>

                    {pet.featured && (
                      <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-black text-white shadow">
                        <FiHeart />
                        Destaque
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="text-2xl font-black text-emerald-950">
                      {pet.name}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm font-semibold leading-relaxed text-zinc-600">
                      {pet.description}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <span className="rounded-2xl bg-emerald-50 px-3 py-2 text-center text-xs font-black text-emerald-700">
                        {getGenderLabel(pet.gender)}
                      </span>

                      <span className="rounded-2xl bg-emerald-50 px-3 py-2 text-center text-xs font-black text-emerald-700">
                        {getSizeLabel(pet.size)}
                      </span>

                      <span className="rounded-2xl bg-zinc-50 px-3 py-2 text-center text-xs font-black text-zinc-700">
                        {pet.age} aninhos
                      </span>

                      <span className="rounded-2xl bg-zinc-50 px-3 py-2 text-center text-xs font-black text-zinc-700">
                        {pet.castrated ? "Castrado" : "Não castrado"}
                      </span>
                    </div>

                    <div className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition group-hover:bg-emerald-500">
                      Conhecer pet
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}