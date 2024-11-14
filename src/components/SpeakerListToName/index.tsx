import React from "react";
import { Input } from "antd";

export default function SpeakerListToName() {
  return (
    <div className="mt-[2rem]">
      {[1, 2, 3].map((item: any, index: number) => (
        <div
          key={index}
          className="md:flex justify-center items-center gap-[2rem] md:mt-[1rem] sm:mt-[2rem] mt-[2rem]"
        >
          <div>Speaker- {index + 1}</div>
          <audio controls className="md:my-0 sm:my-[1rem] my-[1rem]">
            <source src="/audio/sample-audio.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <Input placeholder="Enter name" className="md:w-[15rem]" />
        </div>
      ))}
    </div>
  );
}
