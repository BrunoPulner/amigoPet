import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiDownload,
  FiEdit2,
  FiPlus,
  FiSave,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../services/firebaseConnection";
import { getPets, type Pet } from "../../../services/firestore/getPets";

type MicrochipRow = {
  id: string;
  source: "pet" | "manual";
  petId?: string;
  collectionName?: string;
  procedureDate: string;
  tutorName: string;
  species: "dog" | "cat";
  sex: string;
  microchipNumber: string;
  animalName: string;
  createdAt?: unknown;
};

type DraftRow = Omit<MicrochipRow, "id" | "source">;

const emptyDraft: DraftRow = {
  procedureDate: "",
  tutorName: "",
  species: "dog",
  sex: "male",
  microchipNumber: "",
  animalName: "",
};

function getSpeciesLabel(species: MicrochipRow["species"]) {
  return species === "dog" ? "Cão" : "Gato";
}

function getSexLabel(sex: string) {
  if (sex === "male") return "Macho";
  if (sex === "female") return "Fêmea";
  if (sex === "prince") return "Príncipe";
  if (sex === "princess") return "Princesa";
  return sex || "Não informado";
}

function formatDate(date: string) {
  if (!date) return "Não informado";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return date;

  return `${day}/${month}/${year}`;
}

function getPetMicrochipData(pet: Pet): Omit<MicrochipRow, "id" | "createdAt"> {
  const currentPet = pet as Pet & {
    tutorName?: string;
    responsibleName?: string;
    procedureDate?: string;
    microchipDate?: string;
    sex?: string;
  };

  return {
    source: "pet",
    petId: pet.id,
    collectionName: pet.collectionName,
    procedureDate: currentPet.procedureDate ?? currentPet.microchipDate ?? "",
    tutorName: currentPet.tutorName ?? currentPet.responsibleName ?? "",
    species: pet.species,
    sex: currentPet.sex ?? "",
    microchipNumber: pet.trackingCode ?? "",
    animalName: pet.name,
  };
}

export function Microchips() {
  const [rows, setRows] = useState<MicrochipRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState<DraftRow>(emptyDraft);
  const [rowToDelete, setRowToDelete] = useState<MicrochipRow | null>(null);
  const [editingRows, setEditingRows] = useState<Record<string, MicrochipRow>>(
    {}
  );

  const loadMicrochips = useCallback(async () => {
  try {
    setLoading(true);

    const pets = await getPets();

    const microchipsRef = collection(db, "microchips");
    const snapshot = await getDocs(microchipsRef);

    const existingIds = new Set(snapshot.docs.map((item) => item.id));

    await Promise.all(
      pets.map(async (pet) => {
        const docId = `${pet.collectionName}_${pet.id}`;

        if (existingIds.has(docId)) return;

        const petData = getPetMicrochipData(pet);

        await setDoc(doc(db, "microchips", docId), {
          ...petData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      })
    );

    const updatedSnapshot = await getDocs(microchipsRef);

    const data: MicrochipRow[] = updatedSnapshot.docs.map((item) => {
      const row = item.data();

      return {
        id: item.id,
        source:
          row.source === "pet" || row.source === "manual"
            ? row.source
            : "manual",
        petId: row.petId ?? "",
        collectionName: row.collectionName ?? "",
        procedureDate: row.procedureDate ?? "",
        tutorName: row.tutorName ?? "",
        species: row.species ?? "dog",
        sex: row.sex ?? "",
        microchipNumber: row.microchipNumber ?? "",
        animalName: row.animalName ?? "",
        createdAt: row.createdAt,
      };
    });

    setRows(data);
  } catch (error) {
    console.log(error);
    alert("Erro ao carregar microchips.");
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  async function startLoadingMicrochips() {
    await loadMicrochips();
  }

  startLoadingMicrochips();
}, [loadMicrochips]);

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      const content = [
        row.procedureDate,
        row.tutorName,
        getSpeciesLabel(row.species),
        getSexLabel(row.sex),
        row.microchipNumber,
        row.animalName,
      ]
        .join(" ")
        .toLowerCase();

      return content.includes(normalized);
    });
  }, [rows, searchTerm]);

  function handleDownloadPdf() {
    window.print();
  }

  function handleEdit(row: MicrochipRow) {
    setEditingRows((prevState) => ({
      ...prevState,
      [row.id]: row,
    }));
  }

  function handleCancelEdit(rowId: string) {
    setEditingRows((prevState) => {
      const updated = { ...prevState };
      delete updated[rowId];
      return updated;
    });
  }

  function handleChangeEdit(
    rowId: string,
    field: keyof MicrochipRow,
    value: string
  ) {
    setEditingRows((prevState) => ({
      ...prevState,
      [rowId]: {
        ...prevState[rowId],
        [field]: value,
      },
    }));
  }

  async function handleSaveEdit(rowId: string) {
    const row = editingRows[rowId];

    if (!row) return;

    if (!row.animalName || !row.microchipNumber) {
      alert("Informe o nome do animal e o nº do microchip.");
      return;
    }

    try {
      setSavingId(rowId);

      await updateDoc(doc(db, "microchips", rowId), {
        procedureDate: row.procedureDate,
        tutorName: row.tutorName,
        species: row.species,
        sex: row.sex,
        microchipNumber: row.microchipNumber,
        animalName: row.animalName,
        updatedAt: serverTimestamp(),
      });

      setRows((prevState) =>
        prevState.map((item) => (item.id === rowId ? row : item))
      );

      handleCancelEdit(rowId);
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar alteração.");
    } finally {
      setSavingId("");
    }
  }

  async function handleAddRow() {
    if (!newRow.animalName || !newRow.microchipNumber) {
      alert("Informe o nome do animal e o nº do microchip.");
      return;
    }

    try {
      setSavingId("new");

      const docRef = await addDoc(collection(db, "microchips"), {
        ...newRow,
        source: "manual",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const createdRow: MicrochipRow = {
        id: docRef.id,
        source: "manual",
        ...newRow,
      };

      setRows((prevState) => [createdRow, ...prevState]);
      setNewRow(emptyDraft);
      setShowNewRow(false);
    } catch (error) {
      console.log(error);
      alert("Erro ao adicionar linha.");
    } finally {
      setSavingId("");
    }
  }

  async function handleDeleteRow(row: MicrochipRow) {
  try {
    setSavingId(row.id);

    await deleteDoc(doc(db, "microchips", row.id));

    setRows((prevState) => prevState.filter((item) => item.id !== row.id));
    setRowToDelete(null);
  } catch (error) {
    console.log(error);
    alert("Erro ao deletar linha.");
  } finally {
    setSavingId("");
  }
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
              Planilha interna com os dados de microchipagem dos animais.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowNewRow((prevState) => !prevState)}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-white px-7 text-lg font-black text-emerald-700 shadow-lg shadow-emerald-900/10 transition hover:-translate-y-1 hover:bg-emerald-50"
            >
              <FiPlus className="text-xl" />
              Adicionar linha
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-7 text-lg font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-1 hover:bg-emerald-500"
            >
              <FiDownload className="text-xl" />
              Baixar PDF
            </button>
          </div>
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
              Total de registros listados: {filteredRows.length}
            </p>
          </div>

          <div className="print:hidden mb-6">
            <div className="flex h-14 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white">
              <FiSearch className="text-xl text-emerald-700" />

              <input
                type="text"
                placeholder="Buscar por tutor, animal, nº micro-chip, espécie ou sexo..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-full flex-1 bg-transparent text-base font-semibold text-zinc-800 outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-zinc-100" />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-zinc-200">
              <table className="w-full min-w-[1150px] border-collapse text-left print:min-w-0 print:text-[10px]">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="px-4 py-4 text-sm font-black">
                      Data procedimento
                    </th>
                    <th className="px-4 py-4 text-sm font-black">
                      Tutor ou responsável
                    </th>
                    <th className="px-4 py-4 text-sm font-black">Espécie</th>
                    <th className="px-4 py-4 text-sm font-black">Sexo</th>
                    <th className="px-4 py-4 text-sm font-black">
                      Nº Micro-chip
                    </th>
                    <th className="px-4 py-4 text-sm font-black">
                      Nome do animal
                    </th>
                    <th className="print:hidden px-4 py-4 text-sm font-black">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {showNewRow && (
                    <tr className="border-b border-emerald-100 bg-emerald-50/60">
                      <td className="px-3 py-3">
                        <input
                          type="date"
                          value={newRow.procedureDate}
                          onChange={(event) =>
                            setNewRow({
                              ...newRow,
                              procedureDate: event.target.value,
                            })
                          }
                          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                        />
                      </td>

                      <td className="px-3 py-3">
                        <input
                          type="text"
                          value={newRow.tutorName}
                          onChange={(event) =>
                            setNewRow({
                              ...newRow,
                              tutorName: event.target.value,
                            })
                          }
                          placeholder="Tutor"
                          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                        />
                      </td>

                      <td className="px-3 py-3">
                        <select
                          value={newRow.species}
                          onChange={(event) =>
                            setNewRow({
                              ...newRow,
                              species: event.target.value as "dog" | "cat",
                            })
                          }
                          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                        >
                          <option value="dog">Cão</option>
                          <option value="cat">Gato</option>
                        </select>
                      </td>

                      <td className="px-3 py-3">
                        <select
                          value={newRow.sex}
                          onChange={(event) =>
                            setNewRow({
                              ...newRow,
                              sex: event.target.value,
                            })
                          }
                          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                        >
                          <option value="male">Macho</option>
                          <option value="female">Fêmea</option>
                        </select>
                      </td>

                      <td className="px-3 py-3">
                        <input
                          type="text"
                          value={newRow.microchipNumber}
                          onChange={(event) =>
                            setNewRow({
                              ...newRow,
                              microchipNumber: event.target.value,
                            })
                          }
                          placeholder="Nº micro-chip"
                          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                        />
                      </td>

                      <td className="px-3 py-3">
                        <input
                          type="text"
                          value={newRow.animalName}
                          onChange={(event) =>
                            setNewRow({
                              ...newRow,
                              animalName: event.target.value,
                            })
                          }
                          placeholder="Nome"
                          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                        />
                      </td>

                      <td className="print:hidden px-3 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddRow}
                            disabled={savingId === "new"}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:opacity-60"
                            title="Adicionar"
                          >
                            <FiPlus />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setNewRow(emptyDraft);
                              setShowNewRow(false);
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200 text-zinc-700 transition hover:bg-zinc-300"
                            title="Cancelar"
                          >
                            <FiX />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-xl font-black text-emerald-950"
                      >
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => {
                      const editingRow = editingRows[row.id];
                      const isEditing = Boolean(editingRow);

                      return (
                        <tr
                          key={row.id}
                          className="border-b border-zinc-100 last:border-b-0"
                        >
                          <td className="px-3 py-3 text-sm font-semibold text-zinc-700">
                            {isEditing ? (
                              <input
                                type="date"
                                value={editingRow.procedureDate}
                                onChange={(event) =>
                                  handleChangeEdit(
                                    row.id,
                                    "procedureDate",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                              />
                            ) : (
                              formatDate(row.procedureDate)
                            )}
                          </td>

                          <td className="px-3 py-3 text-sm font-semibold text-zinc-700">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingRow.tutorName}
                                onChange={(event) =>
                                  handleChangeEdit(
                                    row.id,
                                    "tutorName",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                              />
                            ) : (
                              row.tutorName || "Não informado"
                            )}
                          </td>

                          <td className="px-3 py-3 text-sm font-semibold text-zinc-700">
                            {isEditing ? (
                              <select
                                value={editingRow.species}
                                onChange={(event) =>
                                  handleChangeEdit(
                                    row.id,
                                    "species",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                              >
                                <option value="dog">Cão</option>
                                <option value="cat">Gato</option>
                              </select>
                            ) : (
                              getSpeciesLabel(row.species)
                            )}
                          </td>

                          <td className="px-3 py-3 text-sm font-semibold text-zinc-700">
                            {isEditing ? (
                              <select
                                value={editingRow.sex}
                                onChange={(event) =>
                                  handleChangeEdit(
                                    row.id,
                                    "sex",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                              >
                                <option value="">Não informado</option>
                                <option value="male">Macho</option>
                                <option value="female">Fêmea</option>
                                
                              </select>
                            ) : (
                              getSexLabel(row.sex)
                            )}
                          </td>

                          <td className="px-3 py-3 text-sm font-black text-emerald-700">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingRow.microchipNumber}
                                onChange={(event) =>
                                  handleChangeEdit(
                                    row.id,
                                    "microchipNumber",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                              />
                            ) : (
                              row.microchipNumber || "Não informado"
                            )}
                          </td>

                          <td className="px-3 py-3 text-sm font-black text-emerald-950">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingRow.animalName}
                                onChange={(event) =>
                                  handleChangeEdit(
                                    row.id,
                                    "animalName",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500"
                              />
                            ) : (
                              row.animalName || "Não informado"
                            )}
                          </td>

                          <td className="print:hidden px-3 py-3">
                            <div className="flex gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEdit(row.id)}
                                    disabled={savingId === row.id}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:opacity-60"
                                    title="Salvar"
                                  >
                                    <FiSave />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleCancelEdit(row.id)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200 text-zinc-700 transition hover:bg-zinc-300"
                                    title="Cancelar"
                                  >
                                    <FiX />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleEdit(row)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200"
                                    title="Editar"
                                  >
                                    <FiEdit2 />
                                  </button>

                                  <button
                                    type="button"
                                   onClick={() => setRowToDelete(row)}
                                    disabled={savingId === row.id}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-200 disabled:opacity-60"
                                    title="Deletar"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      {rowToDelete && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <FiTrash2 className="text-3xl" />
      </div>

      <h3 className="text-center text-2xl font-black text-emerald-950">
        Deletar linha?
      </h3>

      <p className="mt-3 text-center text-sm font-semibold text-zinc-600">
        Tem certeza que deseja deletar o registro de{" "}
        <strong className="text-emerald-800">{rowToDelete.animalName}</strong>?
        Essa ação não poderá ser desfeita.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setRowToDelete(null)}
          className="h-12 flex-1 rounded-2xl bg-zinc-100 font-black text-zinc-700 transition hover:bg-zinc-200"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={() => handleDeleteRow(rowToDelete)}
          disabled={savingId === rowToDelete.id}
          className="h-12 flex-1 rounded-2xl bg-red-600 font-black text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingId === rowToDelete.id ? "Deletando..." : "Sim, deletar"}
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}