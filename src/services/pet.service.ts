import { Pet } from "../models/pet.model"


const createPet = async (uid: string, name: string, age: number) => {
  try {
    const newPet = await Pet.create({ uid, name, age });
    console.log(newPet);
    return newPet;
  } catch (error) {
    console.error('Error when creating the pet:', error);
    throw error;
  }
}

const getAllPets = async () => {
  return await Pet.findAll();
}

const getPetById = async (uid: string) => {
  try {
    const pet = await Pet.findByPk(uid);
    if (pet) {
      console.log(pet);
      return pet;
    } else {
      console.log('Pet not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting the pet:', error);
    throw error;
  }
}

const updatePet = async (uid: string, name: string, age: number) => {
  try {
    const pet = await Pet.findByPk(uid);

    if (pet) {
      await pet.update({ name, age });
      return pet
    
    } else {
      console.log('Pet not found');
      return null;
    }
  } catch (error) {
    console.error('Failed to update the pet:', error);
    throw error;
  }
};

const deletePet = async (uid: string) => {
  try {
    const pet = await Pet.findByPk(uid);
    if (pet) {
      await pet.destroy();
      console.log('Pet removed');
      return true;
      
    } else {
      console.log('Pet not found');
      return false;
    }
  } catch (error) {
    console.error('Error deleting pet:', error);
    throw error;
  }
}

export const petService = {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,

}