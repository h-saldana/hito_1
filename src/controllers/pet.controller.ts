import { Request, Response, NextFunction } from "express";
import { petService } from "../services/pet.service";
import { HttpError } from "../utils/httpError.util";

const getPets= async (req: Request, res: Response) => {
  try {
      const pets = await petService.getAllPets()
      res.json({
          // email:req.email,
          pets
      })
  } catch (error) {
      console.log(error)
      if (error instanceof Error) {
          res.status(500).json({ error: error.message })
      } else res.status(500).json({ error: "Server Error" })

  }

};


const createPet = async (req: Request, res: Response, next: NextFunction) => {
  try {    
    const { uid , name , age} = req.body;

    if (!uid) throw new HttpError("No token", 401);
    const newPet = await petService.createPet(uid, name, age);
    res.status(201).json({ newPet });
  } catch (error) {
    next(error);
  }
};

const getPetById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req.params;
    const pet = await petService.getPetById(uid);
    if (!pet) {
      throw new HttpError("Pet not found", 404);
    }
    res.status(200).json({ pet });
  } catch (error) {
    next(error);
  }
};

// Actualizar mascota
const updatePet = async (req: Request, res: Response, next: NextFunction) => {
  try {
   
    const {uid, name, age } = req.body;
    const updatedPet = await petService.updatePet(uid, name, age);
    if (!updatedPet) {
      throw new HttpError("Pet not found", 404);
    }
    res.status(200).json({ updatedPet });
  } catch (error) {
    next(error);
  }
};

// Eliminar mascota
const deletePet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req.params;
    const isDeleted = await petService.deletePet(uid);
    if (!isDeleted) {
      throw new HttpError("Pet not found", 404);
    }    
    res.status(200).json({ message: 'Pet successfully removed' });
  } catch (error) {
    next(error);
  }
};

export const petController = {
  getPets,
  createPet,
  getPetById,
  updatePet,
  deletePet,
};
