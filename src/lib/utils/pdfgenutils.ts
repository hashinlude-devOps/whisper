import { jsPDF } from "jspdf";

// Utility to check if text contains Arabic
const containsArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

// Convert ArrayBuffer to Base64 string
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Load the font dynamically based on text content
const loadFont = async (doc: jsPDF, text: string) => {
    let fontUrl = "/fonts/NotoSans-Regular.ttf"; // Default font for non-Arabic text
    const fontName = containsArabic(text) ? "NotoSansArabic" : "NotoSans"; // Set appropriate font name
  
    if (containsArabic(text)) {
      fontUrl = "/fonts/NotoSansArabic-Regular.ttf"; // Arabic font
      console.log(fontName)
    }
  
    try {
      const font = await fetch(fontUrl).then((res) => res.arrayBuffer());
      const fontBase64 = arrayBufferToBase64(font);
  
      doc.addFileToVFS(`${fontName}.ttf`, fontBase64);
      doc.addFont(`${fontName}.ttf`, fontName, "normal");
      doc.setFont(fontName);
      console.log(`Font applied: ${fontName}`);
    } catch (error) {
      console.error("Error loading font:", error);
    }
};

// Render Arabic text (reverse for RTL)
const renderArabicText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number) => {
    const reversedText = text.split('').reverse().join('');  // Reverse the characters for RTL
    console.log(reversedText)
    doc.text(reversedText, x, y, { maxWidth, align: "right" });
};

// Render text with dynamic line height and proper yPos adjustment
const renderTextWithDynamicHeight = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number) => {
  const lines = doc.splitTextToSize(text, maxWidth); // Wrap text into lines based on max width
  const textHeight = lines.length * 7;  // Height is approximately 7 units per line (adjust as needed)
  
  lines.forEach((line:any, index:any) => {
    // Check if we're near the bottom of the page and need a new page
    if (y + textHeight > doc.internal.pageSize.height - 20) { // 20 is for the bottom margin
      doc.addPage();
      y = 20;  // Reset y position for the new page
    }

    // Render each line of wrapped text
    doc.text(line, x, y + index * 7); // Render each line
  });

  return y + textHeight + 2; // Return updated y position after all lines are rendered
};

// Generate Translation PDF
const generateTranslationPDF = async (result: any, timestamp: string) => {
  const doc = new jsPDF();
  const marginLeft = 14;
  const marginTop = 20;
  const marginRight = 14;
  const marginBottom = 20;

  await loadFont(doc, result.recordingname);

  doc.setFontSize(18);
  doc.text("Translation Result", marginLeft, marginTop);

  doc.setFontSize(12);
  doc.text(`Recording Name: ${result.recordingname}`, marginLeft, marginTop + 15);
  const speakerListText = `Speakers: ${result.speaker_list.join(", ")}`;
  doc.text(speakerListText, marginLeft, marginTop + 25);
  doc.text(`Timestamp: ${timestamp}`, marginLeft, marginTop + 35);

  let yPos = marginTop + 45;
  const availableWidth = doc.internal.pageSize.width - marginLeft - marginRight;

  result?.result.forEach((segment: any) => {
    const speakerText = `${segment.speaker}: ${segment.translated_text}`;

    if (yPos + 7 * 5 > doc.internal.pageSize.height - marginBottom) {
      doc.addPage();
      yPos = marginTop;
    }

    if (containsArabic(speakerText)) {
      renderArabicText(doc, speakerText, marginLeft, yPos, availableWidth);
      const textDimensions = doc.getTextDimensions(speakerText);
      yPos += textDimensions.h + 2; // Adjust yPos for Arabic text
    } else {
      yPos = renderTextWithDynamicHeight(doc, speakerText, marginLeft, yPos, availableWidth);
    }
  });

  doc.save("translation_result.pdf");
};

// Generate Transcription PDF
const generateTranscriptionPDF = async (result: any, timestamp: string) => {
  const doc = new jsPDF();
  const marginLeft = 14;
  const marginTop = 20;
  const marginRight = 14;
  const marginBottom = 20;

  await loadFont(doc, result.recordingname);

  doc.setFontSize(18);
  doc.text("Transcription Result", marginLeft, marginTop);

  doc.setFontSize(12);
  doc.text(`Recording Name: ${result.recordingname}`, marginLeft, marginTop + 15);
  const speakerListText = `Speakers: ${result.speaker_list.join(", ")}`;
  doc.text(speakerListText, marginLeft, marginTop + 25);
  doc.text(`Timestamp: ${timestamp}`, marginLeft, marginTop + 35);

  let yPos = marginTop + 45;
  const availableWidth = doc.internal.pageSize.width - marginLeft - marginRight;

  result?.result.forEach((segment: any) => {
    const speakerText = `${segment.speaker}: ${segment.transcribed_text}`;

    if (yPos + 7 * 5 > doc.internal.pageSize.height - marginBottom) {
      doc.addPage();
      yPos = marginTop;
    }

    if (containsArabic(speakerText)) {
      renderArabicText(doc, speakerText, marginLeft, yPos, availableWidth);
      const textDimensions = doc.getTextDimensions(speakerText);
      yPos += textDimensions.h + 2; // Adjust yPos for Arabic text
    } else {
      yPos = renderTextWithDynamicHeight(doc, speakerText, marginLeft, yPos, availableWidth);
    }
  });

  doc.save("transcription_result.pdf");
};

export const generatePDFs = async (result: any, timestamp: string) => {
  await generateTranslationPDF(result, timestamp);
  await generateTranscriptionPDF(result, timestamp);
};
