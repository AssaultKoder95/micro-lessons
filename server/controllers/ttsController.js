// POST /api/tts
// Body: { text, model?, description?, speaker?, f0_up_key?, tone? }
// Returns: audio/wav stream proxied from Rumik

const RUMIK_BASE = "https://silk-api.rumik.ai";

export async function synthesizeSpeech(req, res) {
  const {
    text,
    model = "mulberry",
    description = "clear, engaging educational narrator, warm tone",
    speaker,
    f0_up_key = 0,
    tone, // for muga: neutral | happy | sad | excited | angry | whisper
    temperature = 0.6,
    top_p = 0.95,
    top_k = 50,
    repetition_penalty = 1.2,
    max_new_tokens = 2048,
  } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "text is required" });
  }

  if (!process.env.RUMIK_API_KEY) {
    return res.status(500).json({ error: "RUMIK_API_KEY is not configured on the server." });
  }

  // Muga uses a [tone] prefix; mulberry uses description/speaker
  const finalText =
    model === "muga" ? `[${tone || "neutral"}] ${text}` : text;

  const payload = {
    model,
    text: finalText.slice(0, 2000), // API hard limit
    temperature,
    top_p,
    top_k,
    repetition_penalty,
    max_new_tokens,
  };

  if (model === "mulberry") {
    if (description) payload.description = description;
    if (speaker) payload.speaker = speaker;
    if (f0_up_key !== 0) payload.f0_up_key = f0_up_key;
  }

  try {
    const upstream = await fetch(`${RUMIK_BASE}/v1/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RUMIK_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("Rumik TTS error:", upstream.status, errText);
      return res.status(upstream.status).json({
        error: `Rumik API error: ${upstream.statusText}`,
        detail: errText,
      });
    }

    // Stream the WAV back to the client
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Cache-Control", "no-store");

    const reader = upstream.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    };
    await pump();
  } catch (err) {
    console.error("TTS fetch error:", err);
    res.status(500).json({ error: err.message });
  }
}
