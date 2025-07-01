"use client";

import { useState } from "react";
import Loading from "./_components/loading";
import PaymentForm from "./_components/payment";
import { Profile } from "./_components/profile";

const CreateProfile = () => {
  const [step, setStep] = useState<"profile" | "payment" | "loading">(
    "profile"
  );

  const handleProfileSubmit = () => {
    setStep("loading");

    setTimeout(() => {
      setStep("payment");
    }, 1000); // simulate API or transition delay
  };

  return (
    <div>
      {step === "profile" && <Profile onNext={handleProfileSubmit} />}
      {step === "loading" && <Loading />}
      {step === "payment" && <PaymentForm />}
    </div>
  );
};

export default CreateProfile;
