"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Image from "next/image";

type PublicProfile = {
  name: string;
  avatar: string;
  about: string;
  socialLink: string;
  supporters: { amount: number; message: string; date: string }[];
};

export default function PublicProfilePage() {
  const rawUsername = useParams().username;
  const username =
    typeof rawUsername === "string" ? rawUsername : rawUsername?.[0] ?? "";

  const [data, setData] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    api
      .get(`/view/${username}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>User not found</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <div className="flex items-center gap-4">
        <Image
          src={data.avatar || "/fallback.png"}
          width={64}
          height={64}
          className="rounded-full object-cover"
          alt="Avatar"
        />
        <div>
          <h1 className="text-xl font-semibold">{data.name}</h1>
          <p className="text-sm text-gray-600">{data.about}</p>
          <a
            href={data.socialLink}
            className="text-blue-600 text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.socialLink}
          </a>
        </div>
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-lg font-bold mb-2">Recent Supporters</h2>
        {data.supporters.length === 0 ? (
          <p>No supporters yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.supporters.map((s, i) => (
              <li key={i} className="text-sm">
                <span className="font-semibold">${s.amount}</span> - "
                {s.message}"
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
