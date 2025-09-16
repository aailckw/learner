import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth(req as any);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { content, conversationId, experimental_attachments } = await req.json();

    let conversation = null;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId, userId: session.user.id },
      });
      if (!conversation) {
        return new Response("Conversation not found", { status: 404 });
      }
    } else {
      conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: content?.substring(0, 50) || "New conversation",
        },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        userId: session.user.id,
        role: "user",
        content,
        imageUrl: experimental_attachments?.[0]?.url,
      },
    });

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response("Google API key not configured", { status: 500 });
    }

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: content,
    });

    const text = result.text ?? "";

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: text,
      },
    });

    return new Response(JSON.stringify({ reply: text, conversationId: conversation.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("/api/chat/send error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}


