const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const runBtn = document.getElementById("runBtn");
const statusEl = document.getElementById("status");
const ocrText = document.getElementById("ocrText");
const translatedText = document.getElementById("translatedText");

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    statusEl.textContent = "Escolha um arquivo de imagem.";
    return;
  }
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
  runBtn.disabled = false;
  statusEl.textContent = "Imagem pronta. Toque em Reconhecer e traduzir.";
});

runBtn.addEventListener("click", async () => {
  const file = imageInput.files?.[0];
  if (!file) return;
  runBtn.disabled = true;
  ocrText.value = "";
  translatedText.value = "";
  try {
    const lang = document.getElementById("sourceLang").value;
    statusEl.textContent = "Lendo os textos da imagem... isso pode levar um pouco.";
    const result = await Tesseract.recognize(file, lang, {
      logger: m => {
        if (m.status === "recognizing text") {
          statusEl.textContent = `Reconhecendo texto: ${Math.round((m.progress || 0) * 100)}%`;
        }
      }
    });
    const text = (result.data.text || "").trim();
    ocrText.value = text;
    if (!text) throw new Error("Não consegui reconhecer texto. Tente uma imagem mais nítida ou outro idioma.");
    statusEl.textContent = "Texto reconhecido. Traduzindo...";
    const target = document.getElementById("targetLang").value;
    translatedText.value = await translateText(text, lang, target);
    statusEl.textContent = "Concluído! Confira o resultado: OCR pode cometer erros.";
  } catch (err) {
    statusEl.textContent = err.message || "Ocorreu um erro durante o processamento.";
  } finally {
    runBtn.disabled = false;
  }
});

async function translateText(text, source, target) {
  // A API pública MyMemory usa códigos de idioma ISO; OCR e tradução têm códigos diferentes.
  const sourceMap = { jpn: "ja", eng: "en", kor: "ko", chi_sim: "zh-CN" };
  const from = sourceMap[source] || "en";
  const chunks = text.match(/[\s\S]{1,450}/g) || [];
  const translations = [];
  for (let i = 0; i < chunks.length; i++) {
    statusEl.textContent = `Traduzindo trecho ${i + 1} de ${chunks.length}...`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunks[i])}&langpair=${encodeURIComponent(from)}|${encodeURIComponent(target)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("O serviço de tradução não respondeu. Tente novamente.");
    const data = await response.json();
    if (!data.responseData?.translatedText) throw new Error("Não foi possível obter a tradução.");
    translations.push(data.responseData.translatedText);
  }
  return translations.join("\n");
}

document.getElementById("copyBtn").addEventListener("click", async () => {
  if (!translatedText.value) {
    statusEl.textContent = "Ainda não há tradução para copiar.";
    return;
  }
  try {
    await navigator.clipboard.writeText(translatedText.value);
    statusEl.textContent = "Tradução copiada!";
  } catch {
    translatedText.select();
    statusEl.textContent = "Selecione e copie o texto manualmente.";
  }
});
