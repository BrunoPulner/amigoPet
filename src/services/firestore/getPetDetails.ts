import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebaseConnection";
import type { Pet } from "./getPets";

export type VaccineItem = {
  name: string;
  dose: string;
  date: string;
  nextDoseDate: string;
  veterinarian: string;
  notes: string;
};

export type VaccinationCard = {
  id: string;
  petId: string;
  petCollection: "dogs" | "cats";
  dewormed: boolean;
  fleaTickTreatment: boolean;
  hasVaccines: boolean;
  vaccines: VaccineItem[];
};

export async function getPetDetails(routeId: string) {
  const [collectionName, ...idParts] = routeId.split("-");
  const petId = idParts.join("-");

  if (collectionName !== "dogs" && collectionName !== "cats") {
    throw new Error("Coleção inválida.");
  }

  const petRef = doc(db, collectionName, petId);
  const petSnap = await getDoc(petRef);

  if (!petSnap.exists()) {
    throw new Error("Pet não encontrado.");
  }

  const petData = petSnap.data();

  const pet = {
    id: petSnap.id,
    collectionName,
    ...petData,
  } as Pet;

  let vaccinationCard: VaccinationCard | null = null;

  if (pet.vaccinationCardId) {
    const cardRef = doc(db, "vaccinationCards", pet.vaccinationCardId);
    const cardSnap = await getDoc(cardRef);

    if (cardSnap.exists()) {
      vaccinationCard = {
        id: cardSnap.id,
        ...cardSnap.data(),
      } as VaccinationCard;
    }
  }

  return {
    pet,
    vaccinationCard,
  };
}