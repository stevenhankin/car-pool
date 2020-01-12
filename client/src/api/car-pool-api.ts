import { apiEndpoint } from "../config";
import { Car } from "../types/Car";
import { CreateCarRequest } from "../types/CreateCarRequest";
import Axios, { AxiosResponse } from "axios";
import { UploadUrl } from "../types/UploadUrl";

/**
 * Call API to create a Car
 * @param idToken
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
  // console.log('received car',response.data.item)
  // return response.data.item
}

/**
 * Call API to get cars loaned by a user
 * @param idToken
 * @param newCar
 */
export async function getUserCars(
  jwt: string
  // newCar: CreateCarRequest
): Promise<AxiosResponse<Car[]>> {
  return await Axios.get(`${apiEndpoint}/cars/loaned`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    }
  });
  // console.log('received car',response.data.item)
  // return response.data.item
}

/**
 * Call API to get a signed url for updating car photo
 * @param jwt
 * @param carId
 */
export async function getPhotoUploadUrl(
  jwt: string,
  carId: string
  // newCar: CreateCarRequest
): Promise<AxiosResponse<UploadUrl>> {
  return await Axios.get(`${apiEndpoint}/cars/loaned/${carId}/uploadUrl`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    }
  });
} //: JSON.stringify({ uploadUrl: signedUrl })

/**
 *
 * @param jwt Use a signed url to update a photo for a car
 * @param carId
 */
export async function putPhoto(
  uploadUrl: string,
  file: File
): Promise<AxiosResponse> {
  return await Axios.put(
    uploadUrl,
    file
    // , {
    // headers: {
    //   "Content-Type": "application/json",
    //   Authorization: `Bearer ${jwt}`
    // }}
  );
}

/**
 * Call API to get cars loaned by a user
 * @param jwt
 * @param carId
 */
export async function deleteCar(
  jwt: string,
  carId: string
  // newCar: CreateCarRequest
): Promise<AxiosResponse<Car[]>> {
  return await Axios.delete(`${apiEndpoint}/cars/loaned/${carId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    }
  });
}

/**
 * Obtain a signed url to provide direct access upload to S3 Bucket
 * @param jwt
 * @param carId
 */
// export async function getUploadUrl(
//   jwt: string,
//   carId: string
// ): Promise<string> {
//   const response = await Axios.post(
//     `${apiEndpoint}/cars/${carId}/picture`,
//     '',
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${jwt}`
//       }
//     }
//   );
//   console.log('response from get upload url svc', { response });
//   return Promise.resolve(response.data.uploadUrl);
// }
