import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { subject, grade_level, topic, duration } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert curriculum designer and educator. Create comprehensive, engaging lesson plans that are age-appropriate and aligned with educational standards.`;

    const userPrompt = `Create a detailed lesson plan for:
- Subject: ${subject}
- Grade Level: ${grade_level}
- Topic: ${topic}
- Duration: ${duration} minutes

The lesson plan should include:
1. Clear learning objectives (3-5 objectives)
2. Materials needed
3. Engaging introduction
4. Main activities with timing (array of activity objects with activity name, time allocation, and description)
5. Assessment methods
6. Differentiation strategies
7. Closure/wrap-up
8. Optional homework

Make it practical, engaging, and easy to implement.`;

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
            name: "lesson_plan",
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                objectives: { type: "array", items: { type: "string" } },
                materials_needed: { type: "array", items: { type: "string" } },
                introduction: { type: "string" },
                main_activities: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      activity: { type: "string" },
                      time: { type: "number" },
                      description: { type: "string" }
                    },
                    required: ["activity", "time", "description"]
                  }
                },
                assessment: { type: "string" },
                differentiation: { type: "string" },
                closure: { type: "string" },
                homework: { type: "string" }
              },
              required: ["title", "objectives", "materials_needed", "introduction", "main_activities", "assessment", "differentiation", "closure"]
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
    const lessonPlan = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(lessonPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating lesson:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});