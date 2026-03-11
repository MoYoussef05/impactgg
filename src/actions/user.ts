"use server";

import prisma from "@/lib/prisma";

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      achievements: true,
      guides: true,
      coaching: true,
    },
  });
  return user;
}

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}
