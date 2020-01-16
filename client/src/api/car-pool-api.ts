import { apiEndpoint } from "../config";
import { Car } from "../types/Car";
import { CreateCarRequest } from "../types/CreateCarRequest";
import Axios, { AxiosResponse } from "axios";
import { UploadUrl } from "../types/UploadUrl";

/**
 * Call API to create a Car
 * @param jwt
 * @param newCar
 */
export async function createCar(
  jwt: string,
  newCar: CreateCarRequest
): Promise<AxiosResponse<Car>> {
  return await Axios.post(`${apiEndpoint}/cars`, JSON.stringify(newCar), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    }
  });
}

/**
 * Call API to update a Car
 * @param jwt
 * @param carId
 * @param make
 * @param model
 */
export async function updateCar(
  jwt: string,
  carId: string,
  make: string,
  model: string
): Promise<AxiosResponse<Car>> {
  return await Axios.put(
    `${apiEndpoint}/cars/loaned/${carId}`,
    JSON.stringify({ make, model }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      }
    }
  );
}

/**
 * Call API to get cars loaned by a user
 * @param jwt
 */
export async function getUserCars(jwt: string): Promise<AxiosResponse<Car[]>> {
  return await Axios.get(`${apiEndpoint}/cars/loaned`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    }
  });
}

/**
 * Call API to get a signed url for updating car photo
 * @param jwt
 * @param carId
 */
export async function getPhotoUploadUrl(
  jwt: string,
  carId: string
): Promise<AxiosResponse<UploadUrl>> {
  return await Axios.get(`${apiEndpoint}/cars/loaned/${carId}/uploadUrl`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    }
  });
}

/**
 * Useful for checking if an image exists
 * without actually performing the get
 */
export const checkIfExists = async (
  jwt: string,
  url: string
): Promise<boolean> => {
  try {
    await Axios.head(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Use a signed url to update a photo for a car
 * @param uploadUrl
 * @param file
 */
export async function putPhoto(
  uploadUrl: string,
  file: File
): Promise<AxiosResponse> {
  return await Axios.put(uploadUrl, file);
}

/**
 * Call API to get cars loaned by a user
 * @param jwt
 * @param carId
 */
export async function deleteCar(
  jwt: string,
  carId: string
): Promise<AxiosResponse<Car[]>> {
  return await Axios.delete(`${apiEndpoint}/cars/loaned/${carId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    }
  });
}
