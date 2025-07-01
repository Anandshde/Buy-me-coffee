import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

export const HeaderComponent = () => {
  return (
    <header className="flex justify-between  pl-5 pr-15 pt-6">
      <div className="flex items-center gap-2.5">
        <Image src="/vector.png" alt="asd" width={23} height={23} />
        <p className="text-2xl font-bold">Buy Me Coffee</p>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/flow.png" alt="User avatar" />
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <span className="text-lg font-semibold">Jake</span>
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="mt-2 w-40">
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
