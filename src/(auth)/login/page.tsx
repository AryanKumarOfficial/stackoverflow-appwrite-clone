"use client"
import React from "react";
import {useAuthStore} from "@/store/Auth";

function LoginPage() {
    const {login} = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // collect data
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        //validations

        if (!email || !password) {
            setError(() => "Please fill all the fields.")
            return;
        }
        // handle login and error
        setIsLoading(true);
        setError("")

        // login

        const loginResponse = await login(email?.toString(), password?.toString())
        if (loginResponse.error) {
            setError(() => loginResponse.error!.message);
        }
        setIsLoading(false);
    }

    return (
        <div>Login</div>
    )
}

export default LoginPage;