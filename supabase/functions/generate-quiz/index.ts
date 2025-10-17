import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
<<<<<<< HEAD
    const { title, subject, grade_level, description } = await req.json();
=======
    const { title, subject, grade_level, description, lesson_plan } = await req.json();
>>>>>>> c7de362 (Initial commit from cursor)
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert assessment designer. Create engaging, fair, and age-appropriate quiz questions that effectively measure student understanding.`;

<<<<<<< HEAD
=======
    const lpContext = lesson_plan ? `\n\nUse the following lesson plan details as context. Align questions with its objectives and topic.\n${typeof lesson_plan === "string" ? lesson_plan : JSON.stringify(lesson_plan)}` : "";

>>>>>>> c7de362 (Initial commit from cursor)
    const userPrompt = `Create a quiz with exactly 5 multiple-choice questions and 3 descriptive questions for:
- Title: ${title}
- Subject: ${subject}
- Grade Level: ${grade_level}
${description ? `- Description: ${description}` : ''}
<<<<<<< HEAD
=======
${lpContext}
>>>>>>> c7de362 (Initial commit from cursor)

Each MCQ should have 4 options with exactly one correct answer.
Descriptive questions should require thoughtful answers and include a suggested answer.`;

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
            name: "quiz",
            schema: {
              type: "object",
              properties: {
                mcq_questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      options: { type: "array", items: { type: "string" } },
<<<<<<< HEAD
                      correct_answer: { type: "number" },
=======
                      correct_answer: { type: "string" },
>>>>>>> c7de362 (Initial commit from cursor)
                      points: { type: "number" }
                    },
                    required: ["question", "options", "correct_answer", "points"]
                  }
                },
                descriptive_questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      suggested_answer: { type: "string" },
                      points: { type: "number" }
                    },
                    required: ["question", "suggested_answer", "points"]
                  }
                }
              },
              required: ["mcq_questions", "descriptive_questions"]
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
    const quiz = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(quiz), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});