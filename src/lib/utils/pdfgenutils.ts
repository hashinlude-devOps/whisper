import { jsPDF } from "jspdf";

const formatTime = (ms: number) => {
  const date = new Date(ms * 1000);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

// Translation PDF generation
const generateTranslationPDF = (result: any, timestamp: string) => {
  const doc = new jsPDF();

  const marginLeft = 14;
  const marginTop = 20;
  const marginRight = 14;
  const marginBottom = 20;
  const lineHeight = 7;

  doc.setFontSize(18);
  doc.text("Translation Result", marginLeft, marginTop);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Recording Name: ${result.recordingname}`, marginLeft, marginTop + 15);
  doc.setFontSize(12);
  const speakerListText = `Speakers: ${result.speaker_list.join(", ")}`;
  doc.text(speakerListText, marginLeft, marginTop + 25);
  doc.setFontSize(12);
  doc.text(`Timestamp: ${timestamp}`, marginLeft, marginTop + 35);

  doc.setFont("helvetica", "normal");

  let yPos = marginTop + 45;
  const availableWidth = doc.internal.pageSize.width - marginLeft - marginRight;

  result?.result.forEach((segment: any) => {
    const speakerText = `${segment.speaker}: ${segment.translated_text}`;

    if (yPos + lineHeight * 5 > doc.internal.pageSize.height - marginBottom) {
      doc.addPage();
      yPos = marginTop;
    }

    doc.setFontSize(12);
    const textDimensions = doc.getTextDimensions(speakerText, { maxWidth: availableWidth });
    
    yPos += textDimensions.h;

    if (yPos + textDimensions.h > doc.internal.pageSize.height - marginBottom) {
      doc.addPage();
      yPos = marginTop;
    }

    doc.text(speakerText, marginLeft, yPos, { maxWidth: availableWidth });
    yPos += lineHeight;
    yPos += 2;
  });

  doc.save("translation_result.pdf");
};

// Transcription PDF generation
const generateTranscriptionPDF = (result: any, timestamp: string) => {
  const doc = new jsPDF();

  const marginLeft = 14;
  const marginTop = 20;
  const marginRight = 14;
  const marginBottom = 20;
  const lineHeight = 7;

  doc.setFontSize(18);
  doc.text("Transcription Result", marginLeft, marginTop);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Recording Name: ${result.recordingname}`, marginLeft, marginTop + 15);
  doc.setFontSize(12);
  const speakerListText = `Speakers: ${result.speaker_list.join(", ")}`;
  doc.text(speakerListText, marginLeft, marginTop + 25);
  doc.setFontSize(12);
  doc.text(`Timestamp: ${timestamp}`, marginLeft, marginTop + 35);

  doc.setFont("helvetica", "normal");

  let yPos = marginTop + 45;
  const availableWidth = doc.internal.pageSize.width - marginLeft - marginRight;

  result?.result.forEach((segment: any) => {
    const speakerText = `${segment.speaker}: ${segment.transcribed_text}`;

    if (yPos + lineHeight * 5 > doc.internal.pageSize.height - marginBottom) {
      doc.addPage();
      yPos = marginTop;
    }

    doc.setFontSize(12);
    const textDimensions = doc.getTextDimensions(speakerText, { maxWidth: availableWidth });
    
    yPos += textDimensions.h;

    if (yPos + textDimensions.h > doc.internal.pageSize.height - marginBottom) {
      doc.addPage();
      yPos = marginTop;
    }

    doc.text(speakerText, marginLeft, yPos, { maxWidth: availableWidth });
    yPos += lineHeight;
    yPos += 2;
  });

  doc.save("transcription_result.pdf");
};

export const generatePDFs = (result: any, timestamp: string) => {
  // Generate both PDFs when the button is clicked
  generateTranslationPDF(result, timestamp);
  generateTranscriptionPDF(result, timestamp);
};

