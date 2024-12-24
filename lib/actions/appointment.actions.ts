"use server";

import {APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases} from "@/lib/appwrite.config";
import {ID} from "node-appwrite";
import {parseStringify} from "@/lib/utils";

export const createAppointment = async (appointmentData: CreateAppointmentParams) => {
    try {

        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointmentData
        );
        if (!newAppointment) new Error;
        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error);
    }
};