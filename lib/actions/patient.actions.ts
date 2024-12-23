"use server";

import {users} from "@/lib/appwrite.config";
import {ID, Query} from "node-appwrite";
import {parseStringify} from "@/lib/utils";

export const createUser = async (user: CreateUserParams) => {
    try {
        console.log(user);
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        );

        console.log(newUser);

        return parseStringify(newUser);
    } catch (error: any) {
        if (error && error?.code === 409) {
            const documents = await users.list([
                Query.equal("email", [user.email])
            ]);

            return documents?.users[0];
        }
        console.log(error);
    }
}