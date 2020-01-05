import { apiEndpoint } from '../config'
import { Car } from "../types/Car"
import { CreateCarRequest } from "../types/CreateCarRequest"
import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken';

/**
 * Call API to create a Car
 * @param idToken 
 * @param newCar 
 */
export async function createCar(
    jwt: string,
    newCar: CreateCarRequest
): Promise<Car> {
    const response = await Axios.post(`${apiEndpoint}/cars`, JSON.stringify(newCar), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    })
    return response.data.item
}