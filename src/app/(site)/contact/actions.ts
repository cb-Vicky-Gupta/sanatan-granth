"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2, "Please tell us your name."),
  email: z.string().email("That email address does not look right."),
  subject: z.string().max(140).optional().default(""),
  body: z.string().min(10, "Please write a little more so we can help."),
});

export type ContactState = { status: "idle" | "error" | "success"; message: string };

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") ?? "",
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  await prisma.message.create({ data: parsed.data });

  return {
    status: "success",
    message: "Thank you — your message is with us. We read every one.",
  };
}
