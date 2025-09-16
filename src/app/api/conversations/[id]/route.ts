import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, ctx: any) {
  const params = ctx?.params ?? { id: undefined };
  try {
    const session = await auth(req as any);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            role: true,
            content: true,
            imageUrl: true,
            createdAt: true,
          },
        },
      },
    });

    if (!conversation) {
      return new Response("Conversation not found", { status: 404 });
    }

    // Format messages for the chat UI
    const formattedMessages = conversation.messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt,
      experimental_attachments: msg.imageUrl
        ? [{ url: msg.imageUrl, contentType: "image/*" }]
        : undefined,
    }));

    return NextResponse.json({
      ...conversation,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Failed to fetch conversation:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
