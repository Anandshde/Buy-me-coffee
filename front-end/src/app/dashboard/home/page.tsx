"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { api } from "@/lib/api";

type DashboardData = {
  username: string;
  avatar: string;
  earnings: number;
  transactions: {
    id: string;
    name: string;
    message: string;
    amount: number;
    timeAgo: string;
  }[];
};

export default function DashboardHome() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      setLoading(false);
      return;
    }

    api
      .get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch dashboard:", err);
        setLoading(false);
      });
  }, []);

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Profile Box */}

      <div className="flex items-center gap-4">
        <Image
          src={data.avatar}
          alt="Avatar"
          width={48}
          height={48}
          className="rounded-full object-cover w-12 h-12"
        />

        <div>
          <p className="text-lg font-semibold">{data.username}</p>
          <p className="text-sm text-gray-500">
            buymeacoffee.com/{data.username.toLowerCase()}
          </p>
        </div>
        <button className="ml-auto bg-gray-100 text-sm px-3 py-1 rounded-md">
          Share page link
        </button>
      </div>

      {/* Earnings Box */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Earnings</h2>
          <label htmlFor="earnings-period" className="sr-only">
            Select earnings period
          </label>
          <select
            id="earnings-period"
            className="border rounded px-2 py-1 text-sm"
          >
            <option>Last 30 days</option>
          </select>
        </div>
        <p className="text-3xl font-bold">${data.earnings}</p>
      </div>

      {/* Transactions */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent transactions</h2>
          <span className="text-sm text-gray-500">Amount</span>
        </div>

        {data.transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 space-y-2">
            <Heart className="mx-auto w-6 h-6 text-gray-400" />
            <p className="font-medium">You don’t have any supporters yet</p>
            <p className="text-sm">
              Share your page with your audience to get started.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {data.transactions.map((txn) => (
              <li
                key={txn.id}
                className="flex justify-between items-start border-b pb-2 last:border-none"
              >
                <div>
                  <p className="font-medium">{txn.name}</p>
                  <p className="text-sm text-gray-500">{txn.message}</p>
                </div>
                <span className="text-sm font-semibold whitespace-nowrap">
                  + ${txn.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
