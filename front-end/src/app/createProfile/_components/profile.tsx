"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { api } from "@/lib/api";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  about: z.string().min(5, { message: "Tell us about yourself" }),
  social: z.string().url({ message: "Enter a valid URL" }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const Profile = ({ onNext }: { onNext: () => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      about: "",
      social: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => inputRef.current?.click();

  const onSubmit = async (values: ProfileFormData) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("about", values.about);
    formData.append("socialMediaURL", values.social);
    formData.append("successMessage", "Thanks for your support!");

    const avatarImage = inputRef.current?.files?.[0];
    if (avatarImage) {
      formData.append("avatarImage", avatarImage);
    }

    try {
      const res = await api.post("/profile/create", formData);
      console.log("✅ Profile created:", res.data);
      onNext();
    } catch (err) {
      console.error("❌ Profile creation failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl space-y-8 p-10 border border-gray-200 rounded-xl shadow-sm bg-white">
        <h1 className="font-bold text-3xl">Complete your profile page</h1>

        {/* Upload */}
        <div className="space-y-2">
          <p className="text-base font-medium">Add photo</p>
          <div
            onClick={handleClick}
            className="cursor-pointer border-dotted border-2 border-gray-300 w-[150px] h-[150px] rounded-full flex items-center justify-center overflow-hidden text-gray-500 text-sm hover:border-gray-500 transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Camera className="w-8 h-8" />
            )}
          </div>
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="h-11 text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <textarea
                      className="w-full h-[120px] border rounded-md p-3 text-base resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social media URL</FormLabel>
                  <FormControl>
                    <Input className="h-11 text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="w-full h-11 bg-black text-white text-base font-medium rounded-md"
            >
              Continue
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};
