import { CustomerInterface } from "./customer-interface";
import { PropertyInterface } from "./property-interface";

export interface ReservationInterface {
    id?: number,
    property?: PropertyInterface[],
    customer: CustomerInterface,
    numberOfNights?: number,
    checkIn: string,
    checkOut: string,
    dates: string[],
    totalPrice?: number,
    description?: string,
}
