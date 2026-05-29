import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { db } from "../firebaseConnection";

export type PetImage = {
  name: string;
  path: string;

  url: string;

  mediumPath?: string;
  mediumUrl?: string;

  thumbnailPath?: string;
  thumbnailUrl?: string;

  order?: number;
};

export type Pet = {
  id: string;
  name: string;
  species: "dog" | "cat";
  size: "small" | "medium" | "large";
  age: string;
  description: string;
  status: "available" | "in_process" | "adopted";
  waitingSince: string;
  castrated: boolean;
  featured: boolean;
  images: PetImage[];
  vaccinationCardId: string;
  collectionName: "dogs" | "cats";
  trackingCode: string;
};

async function getPetsByCollection(collectionName: "dogs" | "cats") {
  const petsRef = collection(db, collectionName);
  const petsQuery = query(petsRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(petsQuery);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name ?? "",
      species: data.species ?? (collectionName === "dogs" ? "dog" : "cat"),
      gender: data.gender ?? "prince",
      size: data.size ?? "medium",
      age: data.age ?? "",
      description: data.description ?? "",
      status: data.status ?? "available",
      waitingSince: data.waitingSince ?? "",
      castrated: data.castrated ?? false,
      featured: data.featured ?? false,
      images: data.images ?? [],
      vaccinationCardId: data.vaccinationCardId ?? "",
      collectionName,
      trackingCode: data.trackingCode ?? "",
    } as Pet;
  });
}

export async function getPets() {
  const [dogs, cats] = await Promise.all([
    getPetsByCollection("dogs"),
    getPetsByCollection("cats"),
  ]);

  return [...dogs, ...cats];
}