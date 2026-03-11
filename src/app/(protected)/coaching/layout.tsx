import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coaching",
};

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

