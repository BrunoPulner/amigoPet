import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage } from "../firebaseConnection";

export type Species = "dog" | "cat";

export type VaccineItemPayload = {
  name: string;
  dose: string;
  date: string;
  nextDoseDate: string;
  veterinarian: string;
  notes: string;
};

export type CreatePetPayload = {
  name: string;
  species: Species;
  gender: string;
  size: string;
  age: string;
  description: string;
  status: string;
  waitingSince: string;
  castrated: boolean;
  featured: boolean;
  dewormed: boolean;
  fleaTickTreatment: boolean;
  vaccines: VaccineItemPayload[];
  images: File[];
};

async function uploadPetImages(files: File[], collectionName: string, petId: string) {
  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      const imagePath = `${collectionName}/${petId}/${Date.now()}-${file.name}`;
      const imageRef = ref(storage, imagePath);

      await uploadBytes(imageRef, file);

      const url = await getDownloadURL(imageRef);

      return {
        name: file.name,
        path: imagePath,
        url,
      };
    })
  );

  return uploadedImages;
}

export async function createPet(payload: CreatePetPayload) {
  const collectionName = payload.species === "dog" ? "dogs" : "cats";

  const petRef = doc(collection(db, collectionName));
  const petId = petRef.id;

  const vaccinationCardRef = doc(collection(db, "vaccinationCards"));
  const vaccinationCardId = vaccinationCardRef.id;

  const images = await uploadPetImages(payload.images, collectionName, petId);

  await setDoc(vaccinationCardRef, {
    id: vaccinationCardId,
    petId,
    petCollection: collectionName,

    dewormed: payload.dewormed,
    fleaTickTreatment: payload.fleaTickTreatment,

    hasVaccines: payload.vaccines.length > 0,
    vaccines: payload.vaccines,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await setDoc(petRef, {
    id: petId,

    name: payload.name,
    species: payload.species,
    gender: payload.gender,
    size: payload.size,
    age: payload.age,
    description: payload.description,

    status: payload.status,
    waitingSince: payload.waitingSince,

    castrated: payload.castrated,
    featured: payload.featured,

    images,

    vaccinationCardId,
    hasVaccinationCard: true,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    petId,
    collectionName,
    vaccinationCardId,
  };
}