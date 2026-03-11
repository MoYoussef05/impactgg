"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/getSession";

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

export async function setCoachMode(isCoach: boolean) {
  const session = await getSession();

  if (!session) {
    return {
      ok: false as const,
      message: "You must be signed in to change coach mode.",
    };
  }

  try {
    const updated = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        isCoach,
      },
      select: {
        isCoach: true,
      },
    });

    return {
      ok: true as const,
      isCoach: updated.isCoach,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false as const,
      message: "Failed to update coach mode.",
    };
  }
}

