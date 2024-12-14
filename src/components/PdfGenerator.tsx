import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const generateTranslationDOCX = async (result: any, timestamp: string) => {
  try {
    const response = await fetch("/template/translation_template.docx");
    if (!response.ok) {
      throw new Error(
        `Failed to load translation template: ${response.statusText}`
      );
    }
    const arrayBuffer = await response.arrayBuffer();

    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip);

    const data = {
      recordingname: result.recordingname,
      speakers: result.speaker_list.join(", "),
      timestamp: timestamp,
      segments: result.result.map((segment: any) => ({
        speaker: segment.speaker,
        text: segment.translated_text || "No Text Available", 
      })),
    };

    // console.log(data); 

    doc.setData(data);

    doc.render();

    const out = doc.getZip().generate({ type: "blob" });
    saveAs(out, "translation_result.docx"); 
  } catch (error) {
    // console.error("Error generating Translation DOCX:", error); 
    throw error;
  }
};

const generateTranscriptionDOCX = async (result: any, timestamp: string) => {
  try {
    const response = await fetch("/template/transcription_template.docx");
    if (!response.ok) {
      throw new Error(
        `Failed to load translation template: ${response.statusText}`
      );
    }
    const arrayBuffer = await response.arrayBuffer();

    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip);

    const data = {
      recordingname: result.recordingname,
      speakers: result.speaker_list.join(", "),
      timestamp: timestamp,
      segments: result.result.map((segment: any) => ({
        speaker: segment.speaker,
        text: segment.transcribed_text || "No Text Available", 
      })),
    };
    doc.setData(data);

    doc.render();

    const out = doc.getZip().generate({ type: "blob" });
    saveAs(out, "transcription_result.docx"); 
  } catch (error) {
    // console.error("Error generating Translation DOCX:", error);
    throw error;
  }
};

const generateMeetingMinutesDOCX = async (result: any) => {
  try {
    const response = await fetch("/template/meeting_minutes_template.docx");
    if (!response.ok) {
      throw new Error(`Failed to load meeting minutes template: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip);
    console.log(result)
    const data = {
      attendees: result.attendees ? result.attendees.join(", ") : "", 
      imp_dates: (result.imp_dates && result.imp_dates.length > 0) ? result.imp_dates.join(", ") : "No important dates",
      key_events: result.key_events ? result.key_events.join("\n") : "No key events available", // Join with line breaks
      summary: result.summary || "No summary available", 
    };

    doc.setData(data);

    doc.render();

    const out = doc.getZip().generate({ type: "blob" });
    saveAs(out, "meeting_minutes_result.docx");
  } catch (error) {
    console.error("Error generating Meeting Minutes DOCX:", error);
    throw error;
  }
};

export const generateDOCXFiles = async (result: any, timestamp: string) => {
  try {
    await generateTranslationDOCX(result, timestamp);
    await generateTranscriptionDOCX(result, timestamp);
  } catch (error) {
    // console.error("Error generating DOCX files:", error);
  }
};

export const generateMOMDOCXFile = async (result: any) => {
  try {
    await generateMeetingMinutesDOCX(result);
  } catch (error) {
    console.error("Error generating meeting minutes DOCX file:", error);
  }
};