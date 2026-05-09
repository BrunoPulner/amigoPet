import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import { db, storage } from "../firebaseConnection";
import type { Pet } from "./getPets";

export async function deletePet(pet: Pet) {
  if (pet.images && pet.images.length > 0) {
    await Promise.all(
      pet.images.map(async (image) => {
        if (!image.path) return;

        const imageRef = ref(storage, image.path);
        await deleteObject(imageRef);
      })
    );
  }

  if (pet.vaccinationCardId) {
    await deleteDoc(doc(db, "vaccinationCards", pet.vaccinationCardId));
  }

  await deleteDoc(doc(db, pet.collectionName, pet.id));
}