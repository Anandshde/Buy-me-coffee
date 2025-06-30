import { Left } from "../_components/Left";
import { CreateAccount } from "./_components/CreateAccount";

const SignUp = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left side - orange */}
      <div className="w-1/2 bg-amber-400">
        <Left />
      </div>

      {/* Right side - form */}
      <div className="w-1/2 bg-white">
        <CreateAccount />
      </div>
    </div>
  );
};

export default SignUp;
