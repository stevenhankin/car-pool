import { apiEndpoint } from '../config'
import { Car } from "../types/Car"
import { CreateCarRequest } from "../types/CreateCarRequest"
import Axios, { AxiosResponse } from 'axios'

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
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    })
    // console.log('received car',response.data.item)
    // return response.data.item
}


/**
 * Obtain a signed url to provide direct access upload to S3 Bucket
 * @param jwt 
 * @param carId 
 */
export async function getUploadUrl(
    jwt: string,
    carId: string
  ): Promise<string> {
    const response = await Axios.post(`${apiEndpoint}/cars/${carId}/picture`, '', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }
    })
    console.log('response from get upload url svc', {response})
    return Promise.resolve(response.data.uploadUrl)
  }