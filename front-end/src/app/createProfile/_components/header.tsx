import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="flex justify-between  pl-15 pr-15 pt-6">
      <div className="flex items-center gap-2.5">
        <Image src="/vector.png" alt="asd" width={23} height={23} />
        <p className="text-2xl font-bold">Buy Me Coffee</p>
      </div>
      <div>
        <Button variant={"outline"}>Log out</Button>
      </div>
    </header>
  );
};
