import { deleteObject, ref } from "firebase/storage";
import { storage } from "../config/firebase.config";

export const filters = [
  { id: 2, name: "Pop", value: "pop" },
  { id: 3, name: "Rap", value: "rap" },
  { id: 4, name: "Melody", value: "melody" },
  { id: 5, name: "Balad", value: "balad" },
];

export const filterByLanguage = [
  { id: 1, name: "English", value: "english" },
  { id: 2, name: "VietNamese", value: "vietnamese" }
];

export const deleteAnObject = (referenceUrl) => {
  const deleteRef = ref(storage, referenceUrl);
  deleteObject(deleteRef)
    .then(() => {
      return true;
    })
    .catch((error) => {
      return false;
    });
};
