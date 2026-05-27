import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage } from "../firebaseConnection";
import type { PetImage } from "./getPets";
import type { Species, VaccineItemPayload } from "./createPet";

export type UpdatePetPayload = {
  petId: string;
  collectionName: "dogs" | "cats";
  vaccinationCardId: string;
  trackingCode: string;

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

  existingImages: PetImage[];
  newImages: {
    id: string;
    file: File;
    previewUrl: string;
    order: number;
  }[];
};

async function uploadNewImages(
  images: {
    id: string;
    file: File;
    previewUrl: string;
    order: number;
  }[],
  collectionName: "dogs" | "cats",
  petId: string
) {
  const uploadedImages = await Promise.all(
    images.map(async (image) => {
      const file = image.file;

      const imagePath = `${collectionName}/${petId}/${Date.now()}-${file.name}`;
      const imageRef = ref(storage, imagePath);

      await uploadBytes(imageRef, file);

      const url = await getDownloadURL(imageRef);

      return {
        name: file.name,
        path: imagePath,
        url,
        order: image.order,
      };
    })
  );

  return uploadedImages;
}

export async function updatePet(payload: UpdatePetPayload) {
  const uploadedNewImages = await uploadNewImages(
    payload.newImages,
    payload.collectionName,
    payload.petId
  );

  const images = [...payload.existingImages, ...uploadedNewImages].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999)
  );

  const petRef = doc(db, payload.collectionName, payload.petId);

  await updateDoc(petRef, {
    name: payload.name,
    species: payload.species,
    gender: payload.gender,
    size: payload.size,
    age: payload.age,
    description: payload.description,
    trackingCode: payload.trackingCode.trim(),
    status: payload.status,
    waitingSince: payload.waitingSince,
    castrated: payload.castrated,
    featured: payload.featured,
    images,
    updatedAt: serverTimestamp(),
  });

  const vaccinationRef = doc(db, "vaccinationCards", payload.vaccinationCardId);

  await updateDoc(vaccinationRef, {
    petId: payload.petId,
    petCollection: payload.collectionName,
    dewormed: payload.dewormed,
    fleaTickTreatment: payload.fleaTickTreatment,
    hasVaccines: payload.vaccines.length > 0,
    vaccines: payload.vaccines,
    updatedAt: serverTimestamp(),
  });

  return {
    petId: payload.petId,
    collectionName: payload.collectionName,
    vaccinationCardId: payload.vaccinationCardId,
  };
}