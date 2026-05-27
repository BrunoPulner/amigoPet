import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { toast } from "react-toastify";

import {
  getPetDetails,
  type VaccinationCard,
} from "../../../services/firestore/getPetDetails";
import type { Pet, PetImage } from "../../../services/firestore/getPets";
import { updatePet } from "../../../services/firestore/updatePet";

import { getBlob, ref } from "firebase/storage";
import { storage } from "../../../services/firebaseConnection";

import { ImageCropper } from "../../../components/imageCropper";
import { FiCrop } from "react-icons/fi";

type VaccineItem = {
  id: string;
  name: string;
  dose: string;
  notes: string;
};

type ImagePreview = {
  id: string;
  file: File;
  previewUrl: string;
  order: number;
};

export function EditPet() {
  const { collectionName, id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState<Pet | null>(null);
  const [vaccinationCard, setVaccinationCard] =
    useState<VaccinationCard | null>(null);

  const [name, setName] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [ageValue, setAgeValue] = useState("");
const [ageUnit, setAgeUnit] = useState<"months" | "years">("years");
  const [description, setDescription] = useState("");
  const [waitingSince, setWaitingSince] = useState("");

  const [species, setSpecies] = useState<"dog" | "cat">("dog");
  const [gender, setGender] = useState("macho");
  const [size, setSize] = useState("medium");
  const [status, setStatus] = useState("available");

  const [castrated, setCastrated] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [dewormed, setDewormed] = useState(false);
  const [fleaTickTreatment, setFleaTickTreatment] = useState(false);

  const [existingImages, setExistingImages] = useState<PetImage[]>([]);
  const [newImages, setNewImages] = useState<ImagePreview[]>([]);

  const [cropImageUrl, setCropImageUrl] = useState("");
  const [cropFileName, setCropFileName] = useState("");
  const [editingImageOrder, setEditingImageOrder] = useState<number | null>(null);
  const [editingImagePath, setEditingImagePath] = useState("");

  const [vaccines, setVaccines] = useState<VaccineItem[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      dose: "",
      notes: "",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  function parsePetAge(age: string) {
  const numberMatch = age.match(/\d+/);
  const value = numberMatch ? numberMatch[0] : "";

  const normalizedAge = age.toLowerCase();

  const unit =
    normalizedAge.includes("mês") || normalizedAge.includes("mes")
      ? "months"
      : "years";

  return {
    value,
    unit: unit as "months" | "years",
  };
}

function formatPetAge() {
  const value = Number(ageValue);

  if (!value || value <= 0) return "";

  if (ageUnit === "months") {
    return `${value} ${value === 1 ? "mês" : "meses"}`;
  }

  return `${value} ${value === 1 ? "ano" : "anos"}`;
}

  useEffect(() => {
    async function loadPet() {
      if (!id) return;

      try {
        setLoading(true);

        const data = await getPetDetails(`${collectionName}-${id}`);

        setPet(data.pet);
        setVaccinationCard(data.vaccinationCard);

        setName(data.pet.name);
        setTrackingCode(data.pet.trackingCode ?? "");
        const parsedAge = parsePetAge(data.pet.age || "");

        setAgeValue(parsedAge.value);
        setAgeUnit(parsedAge.unit);
        setDescription(data.pet.description);
        setWaitingSince(data.pet.waitingSince);

        setSpecies(data.pet.species);
        setGender(data.pet.gender);
        setSize(data.pet.size);
        setStatus(data.pet.status);

        setCastrated(data.pet.castrated);
        setFeatured(data.pet.featured);
        setExistingImages(
  [...(data.pet.images ?? [])].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999)
  )
);

        setDewormed(data.vaccinationCard?.dewormed ?? false);
        setFleaTickTreatment(data.vaccinationCard?.fleaTickTreatment ?? false);

        if (data.vaccinationCard?.vaccines?.length) {
          setVaccines(
            data.vaccinationCard.vaccines.map((vaccine) => ({
              id: crypto.randomUUID(),
              name: vaccine.name,
              dose: vaccine.dose,
              date: vaccine.date,
              nextDoseDate: vaccine.nextDoseDate,
              veterinarian: vaccine.veterinarian,
              notes: vaccine.notes,
            }))
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Erro ao carregar informações do pet.");
      } finally {
        setLoading(false);
      }
    }

    loadPet();
  }, [collectionName, id]);

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

    const currentTotal = existingImages.length + newImages.length;

const previews = filesArray.map((file, index) => ({
  id: crypto.randomUUID(),
  file,
  previewUrl: URL.createObjectURL(file),
  order: currentTotal + index + 1,
}));

    setNewImages((prev) => [...prev, ...previews]);

    e.target.value = "";
  }

  function removeExistingImage(path: string) {
    setExistingImages((prev) => prev.filter((image) => image.path !== path));
  }

  function removeNewImage(id: string) {
    setNewImages((prev) => {
      const imageToRemove = prev.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return prev.filter((image) => image.id !== id);
    });
  }

  function updateExistingImageOrder(path: string, order: number) {
  setExistingImages((prev) =>
    prev.map((image) =>
      image.path === path ? { ...image, order } : image
    )
  );
}

function updateNewImageOrder(id: string, order: number) {
  setNewImages((prev) =>
    prev.map((image) =>
      image.id === id ? { ...image, order } : image
    )
  );
}

async function handleResizeExistingImage(image: PetImage, index: number) {
  try {
    const imageOrder = image.order ?? index + 1;

    const imageRef = ref(storage, image.path);
    const blob = await getBlob(imageRef);

    const objectUrl = URL.createObjectURL(blob);

    setCropImageUrl(objectUrl);
    setCropFileName(`pet-${imageOrder}.webp`);
    setEditingImageOrder(imageOrder);
    setEditingImagePath(image.path);
  } catch (error) {
    console.log(error);
    alert("Erro ao carregar a imagem para redimensionar.");
  }
}

function handleCancelCrop() {
  if (cropImageUrl.startsWith("blob:")) {
    URL.revokeObjectURL(cropImageUrl);
  }

  setCropImageUrl("");
  setCropFileName("");
  setEditingImageOrder(null);
  setEditingImagePath("");
}

function handleFinishCrop(file: File) {
  const previewUrl = URL.createObjectURL(file);

  setExistingImages((prev) =>
    prev.filter((image) => image.path !== editingImagePath)
  );

  setNewImages((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      file,
      previewUrl,
      order: editingImageOrder ?? existingImages.length + newImages.length + 1,
    },
  ]);

  handleCancelCrop();
}

  async function handleSavePet() {
    if (!pet || !vaccinationCard) {
      toast.error("Não foi possível identificar o pet ou a carteirinha.");
      return;
    }

    if (
  !name ||
  !trackingCode ||
  !ageValue ||
  Number(ageValue) <= 0 ||
  !description ||
  !waitingSince
) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error("Adicione pelo menos uma imagem do pet.");
      return;
    }

    try {
      setLoadingSave(true);

      const validVaccines = vaccines
        .filter((vaccine) => vaccine.name.trim() !== "")
        .map((vaccine) => ({
          name: vaccine.name,
          dose: vaccine.dose,
          notes: vaccine.notes,
        }));

        const orderedExistingImages = [...existingImages].sort(
  (a, b) => (a.order ?? 999) - (b.order ?? 999)
);

const orderedNewImages = [...newImages].sort(
  (a, b) => a.order - b.order
);

  const formattedAge = formatPetAge();

      await updatePet({
        petId: pet.id,
        collectionName: pet.collectionName,
        vaccinationCardId: vaccinationCard.id,

        name,
        trackingCode,
        species,
        gender,
        size,
        age: formattedAge,
        description,
        status,
        waitingSince,
        castrated,
        featured,
        dewormed,
        fleaTickTreatment,
        vaccines: validVaccines,

        existingImages: orderedExistingImages,
newImages: orderedNewImages,
        
      });

      toast.success("Pet atualizado com sucesso!");
      navigate("/admin");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar o pet.");
    } finally {
      setLoadingSave(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#f4eadc] px-6 py-10">
        <section className="mx-auto max-w-7xl">
          <div className="h-96 animate-pulse rounded-[2rem] bg-white shadow-xl shadow-emerald-900/5" />
        </section>
      </main>
    );
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
              Editar pet
            </h1>

            <p className="mt-2 max-w-2xl text-base font-semibold text-zinc-600">
              Atualize as informações cadastradas de {name || "pet"}.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSavePet}
            disabled={loadingSave}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-7 text-lg font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-1 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiSave className="text-xl" />
            {loadingSave ? "Salvando..." : "Salvar alterações"}
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
    Nº Micro-chip:
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
                    onChange={(e) => setSpecies(e.target.value as "dog" | "cat")}
                    disabled
                    className="w-full cursor-not-allowed rounded-2xl border border-zinc-200 bg-zinc-100 px-4 py-4 text-base font-black text-zinc-500 outline-none"
                  >
                    <option value="dog">Cão</option>
                    <option value="cat">Gato</option>
                  </select>

                  <p className="mt-2 text-xs font-semibold text-zinc-500">
                    A espécie não pode ser alterada porque define a coleção no
                    banco de dados.
                  </p>
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
                    <option value="macho">Macho</option>
                    <option value="femea">Fêmea</option>
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

                  <div className="grid gap-3 sm:grid-cols-[1fr_90px]">
  <input
    type="number"
    min={1}
    placeholder="Ex: 6"
    value={ageValue}
    onChange={(e) => setAgeValue(e.target.value)}
    className="h-14 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-base font-black text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white"
  />

  <select
    value={ageUnit}
    onChange={(e) => setAgeUnit(e.target.value as "months" | "years")}
    className="h-14 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-base font-black text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white"
  >
    <option value="months">Meses</option>
    <option value="years">Anos</option>
  </select>
</div>
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
                    Edite vacinas, vermífugo e observações de saúde.
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
        Defina a ordem das fotos. A imagem número 1 será usada como vitrine.
      </p>
    </div>
  </div>

  <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-emerald-300 bg-emerald-50/60 px-6 text-center transition hover:bg-emerald-50">
    <FiCamera className="text-4xl text-emerald-600" />

    <strong className="mt-2 text-base font-black text-emerald-950">
      Adicionar imagens
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

  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {existingImages.length > 0 || newImages.length > 0 ? (
      <>
        {existingImages.map((image, index) => (
          <div
            key={`${image.path}-${index}`}
            className="group overflow-hidden rounded-[1.7rem] bg-white shadow-lg"
          >
            <div className="relative overflow-hidden rounded-[1.7rem] bg-zinc-100">

              
              <img
                src={image.url}
                alt={image.name}
                className="h-64 w-full bg-zinc-100 object-cover transition duration-300 group-hover:scale-105"
              />

              <button
  type="button"
  onClick={() => handleResizeExistingImage(image, index)}
  className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition hover:scale-110 hover:bg-emerald-500"
  title="Redimensionar imagem"
>
  <FiCrop className="text-lg" />
</button>


              <button
                type="button"
                onClick={() => removeExistingImage(image.path)}
                className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-xl transition hover:scale-110"
              >
                <FiTrash2 className="text-lg" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="truncate text-sm font-black text-white">
                  {image.name}
                </p>
              </div>
            </div>

           

            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-3 py-3">
              <label className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-950">
                  Ordem
                </span>

                <input
                  type="number"
                  min={1}
                  value={image.order ?? index + 1}
                  onChange={(event) =>
                    updateExistingImageOrder(
                      image.path,
                      Number(event.target.value)
                    )
                  }
                  className="h-9 w-16 rounded-full border border-emerald-200 bg-white text-center text-sm font-black text-emerald-800 outline-none focus:border-emerald-500"
                />
              </label>

              {(image.order ?? index + 1) === 1 && (
                <span className="rounded-full bg-orange-500 px-3 py-2 text-xs font-black text-white">
                  Vitrine
                </span>
              )}
            </div>
          </div>
        ))}

        {newImages.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className="group overflow-hidden rounded-[1.7rem] bg-white shadow-lg"
          >
            <div className="relative overflow-hidden rounded-[1.7rem] bg-zinc-100">
              <img
                src={image.previewUrl}
                alt={image.file.name}
                className="h-64 w-full bg-zinc-100 object-cover transition duration-300 group-hover:scale-105"
              />



              <button
                type="button"
                onClick={() => removeNewImage(image.id)}
                className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-xl transition hover:scale-110"
              >
                <FiTrash2 className="text-lg" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="truncate text-sm font-black text-white">
                  {image.file.name}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-3 py-3">
              <label className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-950">
                  Ordem
                </span>

                <input
                  type="number"
                  min={1}
                  value={image.order}
                  onChange={(event) =>
                    updateNewImageOrder(
                      image.id,
                      Number(event.target.value)
                    )
                  }
                  className="h-9 w-16 rounded-full border border-emerald-200 bg-white text-center text-sm font-black text-emerald-800 outline-none focus:border-emerald-500"
                />
              </label>

              {image.order === 1 && (
                <span className="rounded-full bg-orange-500 px-3 py-2 text-xs font-black text-white">
                  Vitrine
                </span>
              )}
            </div>
          </div>
        ))}
      </>
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
              <h2 className="text-2xl font-black">Resumo do pet</h2>

              <div className="mt-5 space-y-3 text-sm font-semibold text-emerald-50">
                <p>
                  Nome: <strong className="text-white">{name}</strong>
                </p>

                <p>
                  Espécie:{" "}
                  <strong className="text-white">
                    {species === "dog" ? "Cão" : "Gato"}
                  </strong>
                </p>

                <p>
                  Idade:{" "}
                  <strong className="text-white">
                    {formatPetAge() || "Não informada"}
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
                  Imagens:{" "}
                  <strong className="text-white">
                    {existingImages.length + newImages.length}
                  </strong>
                </p>

                <p>
                  Vacinas:{" "}
                  <strong className="text-white">{vaccines.length}</strong>
                </p>
              </div>
            </section>
          </aside>
        </form>
      </section>

      {cropImageUrl && (
  <ImageCropper
    imageUrl={cropImageUrl}
    fileName={cropFileName}
    onCancel={handleCancelCrop}
    onCropComplete={handleFinishCrop}
  />
)}
    </main>
  );
}