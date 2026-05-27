import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiSearch } from "react-icons/fi";

import { getPets, type Pet } from "../../../services/firestore/getPets";

function getSpeciesLabel(species: Pet["species"]) {
  return species === "dog" ? "Cão" : "Gato";
}

function getStatusLabel(status: Pet["status"]) {
  if (status === "available") return "Disponível";
  if (status === "in_process") return "Em processo";
  return "Adotado";
}

export function Microchips() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    const normalized = searchTerm.trim().toLowerCase();

    return pets.filter((pet) => {
      const name = pet.name.toLowerCase();
      const microchip = pet.trackingCode?.toLowerCase() ?? "";
      const species = getSpeciesLabel(pet.species).toLowerCase();
      const status = getStatusLabel(pet.status).toLowerCase();

      return (
        name.includes(normalized) ||
        microchip.includes(normalized) ||
        species.includes(normalized) ||
        status.includes(normalized)
      );
    });
  }, [pets, searchTerm]);

  function handleDownloadPdf() {
    window.print();
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f4eadc] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="print:hidden mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm transition hover:bg-emerald-50"
            >
              <FiArrowLeft />
              Voltar ao painel
            </Link>

            <h1 className="mt-5 text-4xl font-black text-emerald-950">
              Micro-chips dos pets
            </h1>

            <p className="mt-2 max-w-2xl text-base font-semibold text-zinc-600">
              Lista interna com todos os pets cadastrados e seus respectivos nº
              de micro-chip.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-7 text-lg font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-1 hover:bg-emerald-500"
          >
            <FiDownload className="text-xl" />
            Baixar PDF
          </button>
        </div>

        <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5 print:shadow-none">
          <div className="mb-6">
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-700">
              Relatório administrativo
            </span>

            <h2 className="mt-4 text-3xl font-black text-emerald-950">
              Lista de micro-chips
            </h2>

            <p className="mt-1 text-sm font-semibold text-zinc-500">
              Total de pets listados: {filteredPets.length}
            </p>
          </div>

          <div className="print:hidden mb-6">
            <div className="flex h-14 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white">
              <FiSearch className="text-xl text-emerald-700" />

              <input
                type="text"
                placeholder="Buscar por nome, nº micro-chip, espécie ou status..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-full flex-1 bg-transparent text-base font-semibold text-zinc-800 outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-zinc-100" />
          ) : filteredPets.length === 0 ? (
            <div className="rounded-2xl bg-zinc-50 p-10 text-center">
              <h3 className="text-2xl font-black text-emerald-950">
                Nenhum pet encontrado
              </h3>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-zinc-200">
              <table className="w-full border-collapse text-left">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="px-4 py-4 text-sm font-black">Pet</th>
                    <th className="px-4 py-4 text-sm font-black">Espécie</th>
                    <th className="px-4 py-4 text-sm font-black">Status</th>
                    <th className="px-4 py-4 text-sm font-black">
                      Nº Micro-chip
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPets.map((pet) => (
                    <tr
                      key={`${pet.collectionName}-${pet.id}`}
                      className="border-b border-zinc-100 last:border-b-0"
                    >
                      <td className="px-4 py-4 text-sm font-black text-emerald-950">
                        {pet.name}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-zinc-700">
                        {getSpeciesLabel(pet.species)}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-zinc-700">
                        {getStatusLabel(pet.status)}
                      </td>

                      <td className="px-4 py-4 text-sm font-black text-emerald-700">
                        {pet.trackingCode || "Não informado"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}