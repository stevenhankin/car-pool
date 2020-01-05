import { apiEndpoint } from '../config'
import { Car } from "../types/Car"
import { CreateCarRequest } from "../types/CreateCarRequest"
import Axios from 'axios'

/**
 * Call API to create a Car
 * @param idToken 
 * @param newCar 
 */
export async function createCar(
    idToken: string,
    newCar: CreateCarRequest
): Promise<Car> {
    const response = await Axios.post(`${apiEndpoint}/cars`, JSON.stringify(newCar), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return response.data.item
}