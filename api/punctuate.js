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
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Bạn là công cụ biên tập dấu câu cho văn bản tiếng Trung.
Nhiệm vụ:
- Chỉ thêm dấu câu phù hợp: ， 。 ？ ！
- Tuyệt đối KHÔNG thêm chữ mới
- Tuyệt đối KHÔNG sửa, thay thế hay diễn giải lại câu
- KHÔNG xuống dòng
- Giữ nguyên văn phong gốc của văn bản đầu vào

Văn bản cần xử lý:
${text.trim()}`
      }),
    });

    const data = await response.json();

    const output =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "";

    return res.status(200).json({ result: output });
  } catch (err) {
    console.error("PUNCTUATE ERROR:", err);
    return res.status(500).json({
      error: "Server crashed",
      detail: err.message,
    });
  }
}
