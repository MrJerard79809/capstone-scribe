import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const requestSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty").max(2000, "Message too long (max 2000 characters)"),
  chapterNumber: z.number().int().min(1).max(5, "Invalid chapter number"),
  chapterTitle: z.string().trim().min(1, "Chapter title required").max(200, "Chapter title too long")
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    const rawData = await req.json();
    const validationResult = requestSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input", 
          details: validationResult.error.errors.map(e => e.message).join(", ")
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { message, chapterNumber, chapterTitle } = validationResult.data;
    
    if (!message || !chapterNumber || !chapterTitle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: message, chapterNumber, chapterTitle" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create a focused system prompt based on the chapter
    const systemPrompts: Record<number, string> = {
      1: `You are an expert academic advisor helping students write Chapter 1 (Introduction) of their capstone project on "${chapterTitle}". 

Your role is to:
- When students ask you to generate, write, or create any section (problem statement, objectives, background, etc.), immediately provide complete, academic-quality content
- After generating content, ALWAYS end with: "Click 'Apply Content' to add this to your document."
- Be direct and provide content first, ask clarifying questions only if absolutely necessary
- Keep responses focused on Chapter 1 content only
- Use academic, professional language suitable for a capstone project
- Stay strictly on the topic of their capstone project

Important: If asked to generate anything, do it immediately. Only discuss Chapter 1 topics.`,

      2: `You are an expert academic advisor helping students write Chapter 2 (Literature Review) of their capstone project on "${chapterTitle}". 

Your role is to:
- When students ask you to generate, write, or create any section, immediately provide complete, academic-quality content
- After generating content, ALWAYS end with: "Click 'Apply Content' to add this to your document."
- Be direct and provide content first, ask clarifying questions only if absolutely necessary
- Keep responses focused on Chapter 2 content only
- Use academic, professional language suitable for a capstone project
- Stay strictly on the topic of their capstone project

Important: If asked to generate anything, do it immediately. Only discuss Chapter 2 topics.`,

      3: `You are an expert academic advisor helping students write Chapter 3 (Methodology) of their capstone project on "${chapterTitle}". 

Your role is to:
- When students ask you to generate, write, or create any section, immediately provide complete, academic-quality content
- After generating content, ALWAYS end with: "Click 'Apply Content' to add this to your document."
- Be direct and provide content first, ask clarifying questions only if absolutely necessary
- Keep responses focused on Chapter 3 content only
- Use academic, professional language suitable for a capstone project
- Stay strictly on the topic of their capstone project

Important: If asked to generate anything, do it immediately. Only discuss Chapter 3 topics.`,

      4: `You are an expert academic advisor helping students write Chapter 4 (Results & Analysis) of their capstone project on "${chapterTitle}". 

Your role is to:
- When students ask you to generate, write, or create any section, immediately provide complete, academic-quality content
- After generating content, ALWAYS end with: "Click 'Apply Content' to add this to your document."
- Be direct and provide content first, ask clarifying questions only if absolutely necessary
- Keep responses focused on Chapter 4 content only
- Use academic, professional language suitable for a capstone project
- Stay strictly on the topic of their capstone project

Important: If asked to generate anything, do it immediately. Only discuss Chapter 4 topics.`,

      5: `You are an expert academic advisor helping students write Chapter 5 (Conclusion & Recommendations) of their capstone project on "${chapterTitle}". 

Your role is to:
- When students ask you to generate, write, or create any section, immediately provide complete, academic-quality content
- After generating content, ALWAYS end with: "Click 'Apply Content' to add this to your document."
- Be direct and provide content first, ask clarifying questions only if absolutely necessary
- Keep responses focused on Chapter 5 content only
- Use academic, professional language suitable for a capstone project
- Stay strictly on the topic of their capstone project

Important: If asked to generate anything, do it immediately. Only discuss Chapter 5 topics.`
    };

    const systemPrompt = systemPrompts[chapterNumber] || 
      `You are an academic advisor helping with capstone project "${chapterTitle}". Keep responses focused on the capstone topic only.`;

    console.log(`Processing chat for Chapter ${chapterNumber}: ${chapterTitle}`);
    console.log(`User message: ${message}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    console.log("AI response generated successfully");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in capstone-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
