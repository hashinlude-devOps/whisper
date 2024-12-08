"use client";

import React from "react";
import { useParams } from "next/navigation";
import { fetchMeetingMinutes } from "@/lib/services/audioService";
import { message } from "antd";

export default function MeetingMinutes() {
  const [result, setResult] = React.useState<any>(null);

  const params = useParams();
  const { id } = params;

  const fetchMeetingMinutesData = async () => {
    try {
      // TODO:HANDLE ERROR
      if (id != null) {
        const response = await fetchMeetingMinutes(id.toString());
        const fetchedResult = response.data;

        if (fetchedResult) {
          setResult(fetchedResult);
        } else {
          message.error("No results found for this transcription.");
        }
      }
    } catch (error) {
      console.error("Error fetching Meeting minutes:", error);
    }
  };

  React.useEffect(() => {
    fetchMeetingMinutesData();
  }, [id]);

  return (
    <>
      {result && (
        <div className="flex flex-col space-y-4 p-[2rem] flex-1 mb-4">
          <div>{result?.file_path}</div>
          <div>
            Number of speakers
            <span className="m-5 font-bold text-2xl">
              {result?.meeting_minutes?.no_of_speakers}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="p-4 bg-gray-50 rounded-lg shadow w-full sm:w-[50%]">
              <h3 className="text-lg font-semibold mb-3">Attendees</h3>
              <div className="flex flex-wrap gap-2">
                {result?.meeting_minutes?.attendees.map(
                  (attendee: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-gray-600 text-sm font-medium rounded"
                    >
                      {attendee}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow w-full sm:w-[50%]">
              <h3 className="text-lg font-semibold mb-3">Important Dates</h3>
              <div className="flex flex-wrap gap-2">
                {result?.meeting_minutes?.imp_dates.map(
                  (date: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-gray-600 text-sm font-medium rounded"
                    >
                      {date}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow w-full">
            <h3 className="text-lg font-semibold mb-3">Summary</h3>
            <div className="flex flex-wrap gap-2">
              {result?.meeting_minutes?.summary}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
