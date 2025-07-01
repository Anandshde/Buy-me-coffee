"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateAccount } from "./_components/CreateAccount";
import { CreateEmail } from "./_components/CreateEmail";

const SignUp = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();

  const handleNext = () => setStep(2);
  const handleSuccess = () => router.push("/login"); // ✅ redirect

  return (
    <div>
      {step === 1 && <CreateAccount onNext={handleNext} />}
      {step === 2 && <CreateEmail onSuccess={handleSuccess} />}
    </div>
  );
};

export default SignUp;
