"use client";
import React from "react";
import {useAuthStore} from "@/store/Auth";

function RegisterPage() {
    const {createAccount, login} = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // collect data
        const formdata = new FormData(e.currentTarget);
        const firstName = formdata.get("firstName");
        const lastName = formdata.get("lastName");
        const email = formdata.get("email");
        const password = formdata.get("password");
        // validate
        if (!firstName || !lastName || !email || !password) {
            setError(() => "Please fill out all the Fields");
            return;
        }
        //call the store

        setIsLoading(true);
        setError("")

        const response = await createAccount(`${firstName} ${lastName}`, email?.toString(), password?.toString());
        if (response.error) {
            setError(() => response.error!.message);
        } else {
            const loginResponse = await login(email?.toString(), password?.toString())
            if (loginResponse.error) {
                setError(() => loginResponse.error!.message)
            }
        }
        setIsLoading(false)
    }
    return (
        <div>
            {error && (
                <p>{error}</p>
            )}
            <form onSubmit={handleSubmit}>

            </form>
        </div>
    )
}

export default RegisterPage;