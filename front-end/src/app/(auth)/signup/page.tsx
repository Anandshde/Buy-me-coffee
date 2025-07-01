"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateAccount } from "./_components/CreateAccount";
import { CreateEmail } from "./_components/CreateEmail";
import { api } from "@/lib/api";

type EmailPassword = {
  email: string;
  password: string;
};

const SignUp = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUsernameNext = (data: { username: string }) => {
    setUsername(data.username);
    setStep(2);
  };

  const handleEmailSuccess = async (data: EmailPassword) => {
    setError("");

    try {
      const res = await api.post("/auth/sign-up", {
        email: data.email,
        password: data.password,
        username,
      });

      console.log("✅ Registered:", res.data);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      {step === 1 && <CreateAccount onNext={handleUsernameNext} />}
      {step === 2 && <CreateEmail onSuccess={handleEmailSuccess} />}
      {error && (
        <p className="text-center text-sm text-red-500 mt-4">{error}</p>
      )}
    </div>
  );
};

export default SignUp;
