"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PublicProfile = {
  name: string;
  avatarImage: string;
  description: string;
  socialLinks: string[];
  supporters: {
    amount: number;
    message: string;
    createdAt: string;
    name: string;
  }[];
};

export default function ViewPage() {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/profile/me")
      .then((res) => setProfile(res.data))
      .catch((error) => console.error("Failed to fetch profile:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/donations", {
        amount: Number(donationAmount),
        message,
      });
      // Refresh the profile data to show new donation
      const res = await api.get("/profile/me");
      setProfile(res.data);
      setDonationAmount("");
      setMessage("");
    } catch (error) {
      console.error("Failed to process donation:", error);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (!profile)
    return <div className="flex justify-center p-8">Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Image
            src={profile.avatarImage || "/fallback.png"}
            width={80}
            height={80}
            className="rounded-full object-cover"
            alt="Profile"
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-600 mt-1">{profile.description}</p>
            {profile.socialLinks?.[0] && (
              <a
                href={profile.socialLinks[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm mt-2 block"
              >
                {profile.socialLinks[0]}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Donation Form */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Support {profile.name}</h2>
        <form onSubmit={handleDonate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message (optional)
            </label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something nice..."
              maxLength={200}
            />
          </div>
          <Button type="submit" className="w-full">
            Support
          </Button>
        </form>
      </div>

      {/* Recent Supporters */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Supporters</h2>
        {!profile.supporters || profile.supporters.length === 0 ? (
          <p className="text-gray-500">No supporters yet. Be the first one!</p>
        ) : (
          <div className="space-y-4">
            {profile.supporters.map((supporter, index) => (
              <div
                key={index}
                className="border-b last:border-0 pb-4 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{supporter.name}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {supporter.message}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${supporter.amount}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(supporter.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
