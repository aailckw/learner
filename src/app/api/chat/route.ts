import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Check authentication via auth helper
    const session = await auth(req as any);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user.id as string;

    const { messages, conversationId } = await req.json();

    // Create or get conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId, userId },
      });
      
      if (!conversation) {
        return new Response("Conversation not found", { status: 404 });
      }
    } else {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: messages[0]?.content?.substring(0, 50) || "New conversation",
        },
      });
    }

    // Save user message
    const userMessage = messages[messages.length - 1];
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        userId,
        role: userMessage.role,
        content: userMessage.content,
        imageUrl: userMessage.experimental_attachments?.[0]?.url,
      },
    });

    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        "Google Gemini API key is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your .env file.",
        { status: 500 }
      );
    }

    // Stream response from Gemini
    const result = streamText({
      model: google("gemini-2.0-flash-exp"),
      messages,
      onFinish: async ({ text }) => {
        // Save assistant message
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: "assistant",
            content: text,
          },
        });
        
        // Update conversation timestamp
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() },
        });
      },
    });

    // Add conversation ID to response headers for new conversations
    const response = result.toDataStreamResponse();
    if (!conversationId) {
      response.headers.set("X-Conversation-Id", conversation.id);
    }
    
    return response;
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
