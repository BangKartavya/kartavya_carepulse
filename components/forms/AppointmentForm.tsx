"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod"
import React, {useState} from "react";
import {getAppointmentSchema} from "@/lib/validation";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {Doctors} from "@/constants";
import CustomFormField from "@/components/CustomFormField";
import {FormFieldType} from "@/components/forms/PatientForm";
import {SelectItem} from "@/components/ui/select";
import SubmitButton from "@/components/SubmitButton";
import {createAppointment, updateAppointment} from "@/lib/actions/appointment.actions";
import {Appointment} from "@/types/appwrite.types";

interface AppointmentFormProps {
    userId: string,
    patientId: string,
    type: "create" | "cancel" | "schedule",
    appointment?: Appointment,
    setOpen?: (open: boolean) => void
}


const AppointmentForm = ({userId, patientId, type, appointment, setOpen}: AppointmentFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const AppointmentFormValidation = getAppointmentSchema(type);

    const buttonLabel = type === "cancel" ? "Cancel Appointment" : (type === "create") ? "Create Appointment" : "Schedule Appointment";

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : "",
            schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
            reason: appointment ? appointment.reason : "",
            note: appointment?.note || "",
            cancellationReason: appointment?.cancellationReason || ""
        },
    });


    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
        let status;
        setIsLoading(true);
        switch (type) {
            case "schedule":
                status = "scheduled";
                break;
            case "cancel":
                status = "cancelled";
                break;
            default:
                status = "pending";
                break;
        }

        try {
            if (type === "create" && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status
                };
                const appointment = await createAppointment(appointmentData);

                if (appointment) {
                    form.reset();
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
                }
            } else {
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values?.primaryPhysician,
                        schedule: new Date(values?.schedule),
                        status: status as Status,
                        cancellationReason: values?.cancellationReason
                    },
                    type
                };

                const updatedAppointment = await updateAppointment(appointmentToUpdate);

                if (updatedAppointment) {
                    setOpen && setOpen(false);
                    form.reset();
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                {type === "create" && <section className="mb-12 space-y-4">
                    <h1 className="header">
                        New Appointment
                    </h1>
                    <p className="text-dark-700">Request a New Appointment in 10 Seconds</p>
                </section>
                }
                {type !== "cancel" && (
                    <>
                        <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.SELECT}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a Doctor"
                        >
                            {Doctors.map((doctor) => (
                                <SelectItem
                                    key={doctor.name}
                                    value={doctor.name}
                                >
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={doctor.image}
                                            alt={doctor.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full border border-dark-500"
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>
                        <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.DATE_PICKER}
                            name="schedule"
                            label="Expected Appointment Date"
                            showTimeSelect
                            dateFormat="MM/dd/YYYY - h:mm aa"
                        />
                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomFormField
                                control={form.control}
                                fieldType={FormFieldType.TEXTAREA}
                                name="reason"
                                label="Reason for Appointment"
                                placeholder="Enter Your Reason for Appointment"
                            />
                            <CustomFormField
                                control={form.control}
                                fieldType={FormFieldType.TEXTAREA}
                                name="note"
                                label="Notes"
                                placeholder="Enter Notes"
                            />
                        </div>
                    </>
                )}
                {type === "cancel" && (
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        name="cancellationReason"
                        label="Reason For Cancellation"
                        placeholder="Enter Reason for Cancellation"
                    />
                )}
                <SubmitButton isLoading={isLoading}
                              className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}>{buttonLabel}</SubmitButton>
            </form>
        </Form>
    );
};

export default AppointmentForm;