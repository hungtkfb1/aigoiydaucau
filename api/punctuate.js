import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Empty text" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Bạn là biên tập viên truyện tiếng Trung.
Nhiệm vụ:
- Thêm dấu câu phù hợp (， 。 ？ ！)
- KHÔNG thêm nội dung mới
- KHÔNG xuống dòng
- Giữ văn phong truyện dân gian

Văn bản:
${text.trim()}`,
    });

    const output =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "";

    return res.status(200).json({ r
