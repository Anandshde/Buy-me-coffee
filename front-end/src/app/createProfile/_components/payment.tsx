"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/lib/api";

const formSchema = z.object({
  country: z.string().nonempty("Please select a country"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits")
    .max(19, "Card number is too long"),
  expiryMonth: z.string().nonempty("Enter month"),
  expiryYear: z.string().nonempty("Enter year"),
  cvc: z
    .string()
    .min(3, "CVC must be at least 3 digits")
    .max(4, "CVC is too long"),
});

type FormValues = z.infer<typeof formSchema>;

export default function PaymentForm() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      firstName: "",
      lastName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    const { expiryMonth, expiryYear, ...rest } = values;

    const expiryDate = new Date(Number(expiryYear), Number(expiryMonth) - 1, 1);

    try {
      const res = await api.post(
        "/bank-card",
        {
          ...rest,
          expiryDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Card saved:", res.data);
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Error saving card:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-xl space-y-6 p-10 border border-gray-200 rounded-xl bg-white shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            How would you like to be paid?
          </h1>
          <p className="text-sm text-gray-500">
            Enter location and payment details
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mongolia">Mongolia</SelectItem>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Names */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Card Number */}
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter card number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expiry and CVC */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="expiryMonth"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Expires</FormLabel>
                    <FormControl>
                      <Input placeholder="Month" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryYear"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="Year" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cvc"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>CVC</FormLabel>
                    <FormControl>
                      <Input placeholder="CVC" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full h-10">
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
