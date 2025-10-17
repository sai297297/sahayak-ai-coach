import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { title, content_type, difficulty_level, topic } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert in creating differentiated learning materials. Create content that is appropriately scaffolded for the specified difficulty level while maintaining engagement and educational value.`;

    const userPrompt = `Create ${content_type} material for:
- Title: ${title}
- Type: ${content_type}
- Difficulty: ${difficulty_level}
- Topic: ${topic}

Include:
1. Main content appropriate for the difficulty level
2. Questions or exercises (3-5)
3. Clear instructions
4. Suggested duration

Make it engaging and suitable for ${difficulty_level} learners.`;

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
          { role: "user", content: userPrompt }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "adaptive_material",
            schema: {
              type: "object",
              properties: {
                content: { type: "string" },
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      type: { type: "string" }
                    }
                  }
                },
                instructions: { type: "string" },
                duration: { type: "number" }
              },
              required: ["content", "questions", "instructions", "duration"]
            }
          }
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("AI gateway error:", response.status, error);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const material = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(material), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating material:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});