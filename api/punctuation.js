export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Empty text" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OpenAI API key" });
    }

    const prompt = `
Bạn là biên tập viên truyện tiếng Trung.
Nhiệm vụ:
- Thêm dấu câu phù hợp: ， 。 ？ ！
- Giữ nguyên chữ, KHÔNG thêm nội dung mới
- Không xuống dòng thừa
- Văn phong tự nhiên như truyện dân gian

Văn bản:
${text}
    `.trim();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You add Chinese punctuation naturally." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!r.ok) {
      const err = await r.text();
      throw new Error(err);
    }

    const data = await r.json();
    const result = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({ result });

  } catch (e) {
    return res.status(500).json({ error: e.message || "AI error" });
  }
}
