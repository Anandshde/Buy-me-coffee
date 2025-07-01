import { Left } from "../_components/Left";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - fixed width on large screens, full on mobile */}
      <div className="hidden md:flex w-1/2 bg-[#FDBA2D]">
        <Left />
      </div>

      {/* Right side - form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        {children}
      </div>
    </div>
  );
}
