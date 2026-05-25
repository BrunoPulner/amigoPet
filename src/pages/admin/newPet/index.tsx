import { useState } from "react";
import {
  FiArrowLeft,
  FiCamera,
  FiCheckCircle,
  FiHeart,
  FiImage,
  FiPlus,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { createPet } from "../../../services/firestore/createPet";

type VaccineItem = {
  id: string;
  name: string;
  dose: string;
  date: string;
  nextDoseDate: string;
  veterinarian: string;
  notes: string;
};

type ImagePreview = {
  id: string;
  file: File;
  previewUrl: string;
};

export function NewPet() {
  const [name, setName] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [waitingSince, setWaitingSince] = useState("");

  const [species, setSpecies] = useState("dog");
  const [gender, setGender] = useState("prince");
  const [size, setSize] = useState("medium");
  const [status, setStatus] = useState("available");

  const navigate = useNavigate();

const [images, setImages] = useState<ImagePreview[]>([]);
const [loadingSave, setLoadingSave] = useState(false);
const [, setErrorMessage] = useState("");

  const [castrated, setCastrated] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [dewormed, setDewormed] = useState(false);
  const [fleaTickTreatment, setFleaTickTreatment] = useState(false);

  const [vaccines, setVaccines] = useState<VaccineItem[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      dose: "",
      date: "",
      nextDoseDate: "",
      veterinarian: "",
      notes: "",
    },
  ]);

  function addVaccine() {
    setVaccines((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        dose: "",
        date: "",
        nextDoseDate: "",
        veterinarian: "",
        notes: "",
      },
    ]);
  }

  function removeVaccine(id: string) {
    setVaccines((prev) => prev.filter((item) => item.id !== id));
  }

  function updateVaccine(id: string, field: keyof VaccineItem, value: string) {
    setVaccines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function handleSelectImages(e: React.ChangeEvent<HTMLInputElement>) {
  if (!e.target.files) return;

  const filesArray = Array.from(e.target.files);

  const previews = filesArray.map((file) => ({
    id: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
  }));

  setImages((prev) => [...prev, ...previews]);

  e.target.value = "";
}

function removeImage(id: string) {
  setImages((prev) => {
    const imageToRemove = prev.find((image) => image.id === id);

    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    return prev.filter((image) => image.id !== id);
  });
}


async function handleSavePet() {
  if (!name || !trackingCode || !age || !description || !waitingSince) {
    setErrorMessage("Preencha todos os campos obrigatórios do cadastro.");
    return;
  }

  if (images.length === 0) {
    setErrorMessage("Adicione pelo menos uma imagem do pet.");
    return;
  }

  try {
    setLoadingSave(true);
    setErrorMessage("");

    const validVaccines = vaccines
      .filter((vaccine) => vaccine.name.trim() !== "")
      .map((vaccine) => ({
        name: vaccine.name,
        dose: vaccine.dose,
        date: vaccine.date,
        nextDoseDate: vaccine.nextDoseDate,
        veterinarian: vaccine.veterinarian,
        notes: vaccine.notes,
      }));

    await createPet({
      name,
      species: species as "dog" | "cat",
      gender,
      size,
      age,
      description,
      status,
      waitingSince,
      castrated,
      featured,
      dewormed,
      fleaTickTreatment,
      vaccines: validVaccines,
      trackingCode,
      images: images.map((image) => image.file),
    });

    toast.success("Pet cadastrado com sucesso!");
    navigate("/admin");
  } catch (error) {
    console.log(error);
    toast.error("Erro ao salvar o pet.");
    setErrorMessage("Erro ao salvar o pet. Verifique as permissões do Firebase.");
  } finally {
    setLoadingSave(false);
  }
}

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f4eadc] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm transition hover:bg-emerald-50"
            >
              <FiArrowLeft />
              Voltar ao painel
            </Link>

            <h1 className="mt-5 text-4xl font-black text-emerald-950">
              Cadastrar novo pet
            </h1>

            <p className="mt-2 max-w-2xl text-base font-semibold text-zinc-600">
              Preencha as informações do cãozinho ou gatinho para disponibilizar
              no sistema de adoção responsável.
            </p>
          </div>

          <button
  type="button"
  onClick={handleSavePet}
  disabled={loadingSave}
  className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-7 text-lg font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-1 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
>
  <FiSave className="text-xl" />
  {loadingSave ? "Salvando..." : "Salvar cadastro"}
</button>
        </div>

        <form className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">
            <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                  🐾
                </div>

                <div>
                  <h2 className="text-2xl font-black text-emerald-950">
                    Dados do pet
                  </h2>
                  <p className="text-sm font-semibold text-zinc-500">
                    Informações principais para identificação.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-black text-zinc-700">
                    Nome do pet *
                  </span>
                  <input
                    type="text"
                    placeholder="Ex: Thor, Mel, Luna..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base font-semibold text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </label>

                <label className="block md:col-span-2">
  <span className="mb-2 block text-sm font-black text-zinc-700">
    Código de rastreio *
  </span>

  <input
    type="text"
    placeholder="Ex: RB-2026-0001, CHIP-123456..."
    value={trackingCode}
    onChange={(e) => setTrackingCode(e.target.value)}
    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base font-semibold text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
  />

  <p className="mt-2 text-xs font-semibold text-zinc-500">
    Informação interna. Este código não será exibido para os usuários.
  </p>
</label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-zinc-700">
                    Espécie *
                  </span>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base font-black text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="dog">Cão</option>
                    <option value="cat">Gato</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-zinc-700">
                    Sexo *
                  </span>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base font-black text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="prince">Príncipe</option>
                    <option value="princess">Princesa</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-zinc-700">
                    Porte *
                  </span>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base font-black text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="small">Pequeno</option>
                    <option value="medium">Médio</option>
                    <option value="large">Grande</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-zinc-700">
                    Idade aproximada *
                  </span>
                  <input
                    type="text"
                    placeholder="Ex: 2 anos, 6 meses..."
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base font-semibold text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-black text-zinc-700">
                    Descrição *
                  </span>
                  <textarea
                    placeholder="Conte um pouco sobre o comportamento, cuidados, personalidade e história do pet..."
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base font-semibold text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                  ❤️
                </div>

                <div>
                  <h2 className="text-2xl font-black text-emerald-950">
                    Status e adoção
                  </h2>
                  <p className="text-sm font-semibold text-zinc-500">
                    Controle de disponibilidade e destaque.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-zinc-700">
                    Status *
                  </span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base font-black text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="available">Disponível</option>
                    <option value="in_process">Em processo de adoção</option>
                    <option value="adopted">Adotado</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-zinc-700">
                    Esperando desde *
                  </span>
                  <input
                    type="date"
                    value={waitingSince}
                    onChange={(e) => setWaitingSince(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base font-semibold text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setCastrated(!castrated)}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                    castrated
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  <div>
                    <strong className="block text-base font-black text-zinc-800">
                      Castrado
                    </strong>
                    <span className="text-sm font-semibold text-zinc-500">
                      Marque se o pet já foi castrado.
                    </span>
                  </div>

                  <FiCheckCircle
                    className={`text-2xl ${
                      castrated ? "text-emerald-600" : "text-zinc-300"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                    featured
                      ? "border-orange-400 bg-orange-50"
                      : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  <div>
                    <strong className="block text-base font-black text-zinc-800">
                      Destaque da semana
                    </strong>
                    <span className="text-sm font-semibold text-zinc-500">
                      Exibir com destaque na página inicial.
                    </span>
                  </div>

                  <FiHeart
                    className={`text-2xl ${
                      featured ? "text-orange-500" : "text-zinc-300"
                    }`}
                  />
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl">
                  💉
                </div>

                <div>
                  <h2 className="text-2xl font-black text-emerald-950">
                    Carteirinha de vacinação
                  </h2>
                  <p className="text-sm font-semibold text-zinc-500">
                    Registre vacinas, vermífugo e observações de saúde.
                  </p>
                </div>
              </div>

              <div className="mb-6 grid gap-5 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setDewormed(!dewormed)}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                    dewormed
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  <div>
                    <strong className="block text-base font-black text-zinc-800">
                      Vermifugado
                    </strong>
                    <span className="text-sm font-semibold text-zinc-500">
                      Marque se já recebeu vermífugo.
                    </span>
                  </div>

                  <FiCheckCircle
                    className={`text-2xl ${
                      dewormed ? "text-emerald-600" : "text-zinc-300"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setFleaTickTreatment(!fleaTickTreatment)}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                    fleaTickTreatment
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  <div>
                    <strong className="block text-base font-black text-zinc-800">
                      Antipulgas/carrapatos
                    </strong>
                    <span className="text-sm font-semibold text-zinc-500">
                      Marque se recebeu tratamento.
                    </span>
                  </div>

                  <FiCheckCircle
                    className={`text-2xl ${
                      fleaTickTreatment ? "text-emerald-600" : "text-zinc-300"
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-5">
                {vaccines.map((vaccine, index) => (
                  <div
                    key={vaccine.id}
                    className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <h3 className="text-lg font-black text-emerald-950">
                        Vacina {index + 1}
                      </h3>

                      {vaccines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVaccine(vaccine.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-500 transition hover:bg-red-200"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="text"
                        placeholder={
                          species === "dog"
                            ? "Nome da vacina: V8/V10, Antirrábica..."
                            : "Nome da vacina: V3/V4/V5, Antirrábica..."
                        }
                        value={vaccine.name}
                        onChange={(e) =>
                          updateVaccine(vaccine.id, "name", e.target.value)
                        }
                        className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-emerald-500"
                      />

                      <input
                        type="text"
                        placeholder="Dose: 1ª dose, reforço..."
                        value={vaccine.dose}
                        onChange={(e) =>
                          updateVaccine(vaccine.id, "dose", e.target.value)
                        }
                        className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-emerald-500"
                      />

                      <label className="block">
                        <span className="mb-2 block text-xs font-black text-zinc-500">
                          Data da aplicação
                        </span>
                        <input
                          type="date"
                          value={vaccine.date}
                          onChange={(e) =>
                            updateVaccine(vaccine.id, "date", e.target.value)
                          }
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-emerald-500"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-xs font-black text-zinc-500">
                          Próxima dose
                        </span>
                        <input
                          type="date"
                          value={vaccine.nextDoseDate}
                          onChange={(e) =>
                            updateVaccine(
                              vaccine.id,
                              "nextDoseDate",
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-emerald-500"
                        />
                      </label>

                      <input
                        type="text"
                        placeholder="Veterinário ou responsável"
                        value={vaccine.veterinarian}
                        onChange={(e) =>
                          updateVaccine(
                            vaccine.id,
                            "veterinarian",
                            e.target.value
                          )
                        }
                        className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-emerald-500 md:col-span-2"
                      />

                      <textarea
                        placeholder="Observações da vacina..."
                        rows={3}
                        value={vaccine.notes}
                        onChange={(e) =>
                          updateVaccine(vaccine.id, "notes", e.target.value)
                        }
                        className="resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-emerald-500 md:col-span-2"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addVaccine}
                className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-100 px-5 font-black text-emerald-700 transition hover:bg-emerald-200"
              >
                <FiPlus />
                Adicionar vacina
              </button>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5">
  <div className="mb-6 flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
      📸
    </div>

    <div>
      <h2 className="text-2xl font-black text-emerald-950">
        Imagens
      </h2>

      <p className="text-sm font-semibold text-zinc-500">
        Adicione fotos do pet.
      </p>
    </div>
  </div>

  <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-emerald-300 bg-emerald-50/60 px-6 text-center transition hover:bg-emerald-50">
  <FiCamera className="text-4xl text-emerald-600" />

  <strong className="mt-2 text-base font-black text-emerald-950">
    Selecionar imagens
  </strong>

  <span className="mt-1 max-w-xs text-xs font-semibold text-zinc-500">
    JPG, PNG ou WEBP
  </span>

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleSelectImages}
    className="hidden"
  />
</label>

  <div className="mt-6 grid grid-cols-2 gap-4">
  {images.length > 0 ? (
    images.map((image) => (
      <div
        key={image.id}
        className="group relative overflow-hidden rounded-[1.7rem] bg-zinc-100 shadow-lg"
      >
        <img
          src={image.previewUrl}
          alt={image.file.name}
          className="h-64 w-full bg-zinc-100 object-cover transition duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

        <button
          type="button"
          onClick={() => removeImage(image.id)}
          className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-xl opacity-0 transition group-hover:opacity-100 hover:scale-110"
        >
          <FiTrash2 className="text-xl" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition group-hover:opacity-100">
          <p className="truncate text-sm font-black text-white">
            {image.file.name}
          </p>
        </div>
      </div>
    ))
  ) : (
    <>
      {[1, 2].map((item) => (
        <div
          key={item}
          className="flex h-64 items-center justify-center rounded-[1.7rem] border border-zinc-200 bg-zinc-50 text-zinc-300"
        >
          <FiImage className="text-6xl" />
        </div>
      ))}
    </>
  )}
</div>
</section>

            <section className="rounded-[2rem] bg-emerald-700 p-6 text-white shadow-xl shadow-emerald-900/10">
              <h2 className="text-2xl font-black">Resumo do cadastro</h2>

              <div className="mt-5 space-y-3 text-sm font-semibold text-emerald-50">
                <p>
                  Nome:{" "}
                  <strong className="text-white">
                    {name || "Não informado"}
                  </strong>
                </p>

                <p>
                  Espécie:{" "}
                  <strong className="text-white">
                    {species === "dog" ? "Cão" : "Gato"}
                  </strong>
                </p>

                <p>
                  Sexo:{" "}
                  <strong className="text-white">
                    {gender === "prince" ? "Príncipe" : "Princesa"}
                  </strong>
                </p>

                <p>
                  Porte:{" "}
                  <strong className="text-white">
                    {size === "small"
                      ? "Pequeno"
                      : size === "medium"
                      ? "Médio"
                      : "Grande"}
                  </strong>
                </p>

                <p>
                  Idade:{" "}
                  <strong className="text-white">
                    {age || "Não informada"}
                  </strong>
                </p>

                <p>
                  Status:{" "}
                  <strong className="text-white">
                    {status === "available"
                      ? "Disponível"
                      : status === "in_process"
                      ? "Em processo de adoção"
                      : "Adotado"}
                  </strong>
                </p>

                <p>
                  Esperando desde:{" "}
                  <strong className="text-white">
                    {waitingSince || "Não informado"}
                  </strong>
                </p>

                <p>
                  Castrado:{" "}
                  <strong className="text-white">
                    {castrated ? "Sim" : "Não"}
                  </strong>
                </p>

                <p>
                  Destaque da semana:{" "}
                  <strong className="text-white">
                    {featured ? "Sim" : "Não"}
                  </strong>
                </p>

                <div>
                  <p className="mb-1">Descrição:</p>
                  <strong className="block rounded-2xl bg-white/10 p-3 text-white">
                    {description || "Nenhuma descrição informada."}
                  </strong>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/5">
              <h2 className="text-2xl font-black text-emerald-950">
                Resumo da carteirinha
              </h2>

              <div className="mt-5 space-y-3 text-sm font-semibold text-zinc-600">
                <p>
                  Vermifugado:{" "}
                  <strong className="text-emerald-700">
                    {dewormed ? "Sim" : "Não"}
                  </strong>
                </p>

                <p>
                  Antipulgas/carrapatos:{" "}
                  <strong className="text-emerald-700">
                    {fleaTickTreatment ? "Sim" : "Não"}
                  </strong>
                </p>

                <p>
                  Vacinas adicionadas:{" "}
                  <strong className="text-emerald-700">{vaccines.length}</strong>
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {vaccines.map((vaccine, index) => (
                  <div
                    key={vaccine.id}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                  >
                    <h3 className="text-base font-black text-emerald-950">
                      Vacina {index + 1}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm font-semibold text-zinc-600">
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
                        Data da aplicação:{" "}
                        <strong className="text-zinc-800">
                          {vaccine.date || "Não informada"}
                        </strong>
                      </p>

                      <p>
                        Próxima dose:{" "}
                        <strong className="text-zinc-800">
                          {vaccine.nextDoseDate || "Não informada"}
                        </strong>
                      </p>

                      <p>
                        Veterinário/responsável:{" "}
                        <strong className="text-zinc-800">
                          {vaccine.veterinarian || "Não informado"}
                        </strong>
                      </p>

                      <div>
                        <p>Observações:</p>
                        <strong className="mt-1 block rounded-xl bg-white p-3 text-zinc-800">
                          {vaccine.notes || "Nenhuma observação informada."}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </form>
      </section>
    </main>
  );
}