import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { resizeImage } from "../../utils/resizeImage";

import { db, storage } from "../firebaseConnection";

export type Species = "dog" | "cat";

export type VaccineItemPayload = {
  name: string;
  dose: string;
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
  trackingCode?: string;
};

async function uploadPetImages(
  files: File[],
  collectionName: string,
  petId: string
) {
  const uploadedImages = await Promise.all(
    files.map(async (file, index) => {
      const timestamp = Date.now();
      const safeName = file.name.replace(/\s+/g, "-").toLowerCase();

      const originalFile = file;
      const mediumFile = await resizeImage(file, 900, 0.82);
      const thumbnailFile = await resizeImage(file, 480, 0.72);

      const originalPath = `${collectionName}/${petId}/original/${timestamp}-${safeName}`;
      const mediumPath = `${collectionName}/${petId}/medium/${timestamp}-${safeName}`;
      const thumbnailPath = `${collectionName}/${petId}/thumbnail/${timestamp}-${safeName}`;

      const originalRef = ref(storage, originalPath);
      const mediumRef = ref(storage, mediumPath);
      const thumbnailRef = ref(storage, thumbnailPath);

      await Promise.all([
        uploadBytes(originalRef, originalFile),
        uploadBytes(mediumRef, mediumFile),
        uploadBytes(thumbnailRef, thumbnailFile),
      ]);

      const [url, mediumUrl, thumbnailUrl] = await Promise.all([
        getDownloadURL(originalRef),
        getDownloadURL(mediumRef),
        getDownloadURL(thumbnailRef),
      ]);

      return {
        name: safeName,
        path: originalPath,
        url,

        mediumPath,
        mediumUrl,

        thumbnailPath,
        thumbnailUrl,

        order: index + 1,
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
    trackingCode: payload.trackingCode?.trim(),
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
    trackingCode: payload.trackingCode ?? "",
  };
}