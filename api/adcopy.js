import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { page, mode, cluster_label, insight, tone, length, cta } = req.body;

    const target =
      mode === "seg"
        ? `分群中心族群：${cluster_label}`
        : `洞察族群：${insight?.label}`;

    const prompt = `
請用繁體中文產生一段電商投放廣告文案：
【投放對象】${target}
【語氣】${tone || "專業親切"}
【長度】${length || "80-120字"}
【CTA】${cta || "立即查看"}

限制：
- 不要提到 AI
- 不要誇大承諾
`;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: prompt
    });

    res.status(200).json({ copy: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GPT generation failed" });
  }
}
