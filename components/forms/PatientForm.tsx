"use client";

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Form} from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import {useState} from "react";
import {UserFormValidation} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {createUser} from "@/lib/actions/patient.actions";
import {useToast} from "@/hooks/use-toast";

export enum FormFieldType {
    INPUT = "input",
    CHECKBOX = "checkbox",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton"
}

const PatientForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {toast} = useToast();

    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",

        },
    });


    // 2. Define a submit handler.
    const onSubmit = async ({name, email, phone}: z.infer<typeof UserFormValidation>) => {
        setIsLoading(true);
        try {
            const userData = {
                name,
                email,
                phone
            };

            const user = await createUser(userData);

            if (user) router.push(`/patients/${user.$id}/register`);
            else {
                return toast({
                    title: "Registration Failed",
                    description: "Try again later",
                    className: "bg-dark-100"
                })
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">
                        Hi There 👋
                    </h1>
                    <p className="text-dark-700">Schedule your first appointment</p>
                </section>
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name="email"
                    label="Email"
                    placeholder="johndoe@gmail.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />

                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.PHONE_INPUT}
                    name="phone"
                    label="Phone Number"
                    placeholder="1234 567890"
                />
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    );
};

export default PatientForm;