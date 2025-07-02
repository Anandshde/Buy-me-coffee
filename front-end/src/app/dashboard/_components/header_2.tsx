"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type Profile = {
  name: string;
  avatarImage: string;
};

export const HeaderComponent = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove auth token
    router.push("/login"); // redirect to login
  };

  useEffect(() => {
    api
      .get("/profile/me")
      .then((res) => setProfile(res.data.profile as Profile))
      .catch(() => setProfile(null));
  }, []);

  return (
    <header className="flex justify-between pl-5 pr-15 pt-6">
      <div className="flex items-center gap-2.5">
        <Image src="/vector.png" alt="Logo" width={23} height={23} />
        <p className="text-2xl font-bold">Buy Me Coffee</p>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={profile?.avatarImage ?? "/flow.png"}
                alt="User avatar"
              />
              <AvatarFallback>
                {profile?.name ? profile.name[0] : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-lg font-semibold">
              {profile?.name ?? "User"}
            </span>
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="mt-2 w-40">
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
