import React from "react";
import { Button } from "antd";
import jsPDF from "jspdf";

export default function TranslateComponent({ script }: any) {
  const handleDownloadPDF = () => {
    if (!script || !script.updated_result) return;

    // Initialize jsPDF
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Transcribed Script", 10, 10);

    // Add content
    script.updated_result.forEach((item: any, index: any) => {
      const yPosition = 20 + index * 10; // Adjust line spacing
      doc.setFontSize(14);
      doc.text(`${item.speaker}:`, 10, yPosition);
      doc.setFontSize(12);
      doc.text(item.transcribed_text, 20, yPosition + 5);
    });

    // Save the PDF
    doc.save("transcribed_script.pdf");
  };
  return (
    <div className="grid md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[2rem]">
      <div className="mt-[2rem]">
        <div className="border rounded-2xl p-[1rem]">
          <div className="md:flex justify-between items-center">
            <div className="font-[500]">Transcribed</div>
            <div>
              <Button
                type="primary"
                className="bg-black"
                onClick={() => handleDownloadPDF()}
              >
                Donwload
              </Button>
            </div>
          </div>
          {script && (
            <div className="px-[1rem]">
              {script?.updated_result?.map((item: any, index: number) => (
                <div className="mt-[1rem]" key={index}>
                  <div className="underline">{item?.speaker}</div>
                  <div>{item?.transcribed_text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-[2rem]">
        <div className="border rounded-2xl p-[1rem]">
          <div className="md:flex justify-between items-center">
            <div className="font-[500]">Translated</div>
            <div>
              <Button type="primary" className="bg-black">
                Donwload
              </Button>
            </div>
          </div>
          {script && (
            <div className="px-[1rem]">
              {script?.updated_result?.map((item: any, index: number) => (
                <div key={index} className="mt-[1rem]">
                  <div className="underline">{item?.speaker}</div>
                  <div>{item?.translated_text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
