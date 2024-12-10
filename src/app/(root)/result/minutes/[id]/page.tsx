"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  fetchMeetingMinutes,
  viewMeetingMinutes,
} from "@/lib/services/audioService";
import { message } from "antd";
import Loader from "@/components/Loader";

export default function MeetingMinutes() {
  const [result, setResult] = React.useState<any>(null);

  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(false);


  const fetchMeetingMinutesData = async () => {
    try {
      if (id != null) {
        try {
          setLoading(true);
          // Call viewMeetingMinutes to check if the data already exists
          const viewResponse = await viewMeetingMinutes(id.toString());

          // If viewMeetingMinutes does not throw an error, set the result directly
          const fetchedResult = viewResponse.data;

          if (viewResponse.status == 200) {
            setResult(fetchedResult);
            setLoading(false);
            return; 
          }
        } catch (viewError: any) {
          // If viewMeetingMinutes throws a 404 error, proceed to fetchMeetingMinutes
          if (viewError.response?.status === 404) {
            console.log("Meeting minutes not found. Proceeding to fetch...");
          } else {
            console.error(
              "Error checking meeting minutes availability:",
              viewError
            );
            message.error(
              "An error occurred while checking meeting minutes availability."
            );
            return; // Exit the function on unexpected error
          }
        }

        // Call fetchMeetingMinutes if not already fetched
        const response = await fetchMeetingMinutes(id.toString());
        const fetchedResult = response.data;

        if (fetchedResult) {
          setResult(fetchedResult);
          setLoading(false);
        } else {
          message.error("No results found for this transcription.");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching Meeting minutes:", error);
      message.error("An error occurred while fetching meeting minutes.");
      setLoading(false);
    }finally{
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMeetingMinutesData();
  }, [id]);

  return (
    <>
    {loading ? (
      <Loader />
    ) : (
      result && (
        <div className="flex flex-col space-y-4 p-6 flex-1 mb-4 bg-black text-white-1 lg:ml-[16rem]">
          <div>{result?.file_path}</div>
          <div>
            Number of speakers
            <span className="m-5 font-bold text-2xl text-blue-500">
              {result?.meeting_minutes?.no_of_speakers}
            </span>
          </div>
  
          <div className="flex flex-col md:flex-row gap-4">
            <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full sm:w-[50%]">
              <h3 className="text-lg font-semibold mb-3 text-white-1">
                Attendees
              </h3>
              <div className="flex flex-wrap gap-2">
                {result?.meeting_minutes?.attendees.map(
                  (attendee: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-500 text-gray-900 text-sm font-medium rounded"
                    >
                      {attendee}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full sm:w-[50%]">
              <h3 className="text-lg font-semibold mb-3 text-white-1">
                Important Dates
              </h3>
              <div className="flex flex-wrap gap-2">
                {result?.meeting_minutes?.imp_dates.map(
                  (date: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500 text-white-1 text-sm font-medium rounded"
                    >
                      {date}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full">
            <h3 className="text-lg font-semibold mb-3 text-white-500">
              Key Events
            </h3>
            <div className="flex flex-wrap gap-2">
              {result?.meeting_minutes?.key_events.length > 0 ? (
                result?.meeting_minutes?.key_events.map(
                  (event: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-500 text-gray-900 text-sm font-medium rounded"
                    >
                      {event}
                    </span>
                  )
                )
              ) : (
                <span className="text-sm text-gray-400">
                  No key events available
                </span>
              )}
            </div>
          </div>
  
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full">
            <h3 className="text-lg font-semibold mb-3 text-white-1">Summary</h3>
            <div className="text-sm">
              <p>{result?.meeting_minutes?.summary}</p>
            </div>
          </div>
        </div>
      )
    )}
  </>
  
  );
}