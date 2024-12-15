"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchMeetingMinutes,
  viewMeetingMinutes,
} from "@/lib/services/audioService";
import { message, Tooltip } from "antd";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { HiDownload } from "react-icons/hi";
import {
  generateMOMDOCXFile,
} from "@/components/PdfGenerator";
import { useSidebar } from "@/context/ContextProvider";

export default function MeetingMinutes() {
  const [result, setResult] = React.useState<any>(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const { setCurrentMeetingId} = useSidebar();

  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchMeetingMinutesData = async () => {
    if (!id || isDataFetched) return;

    setLoading(true);
    try {
      const viewResponse = await viewMeetingMinutes(id.toString());
      if (viewResponse.status === 200 && viewResponse.data) {
        setResult(viewResponse.data);
        setIsDataFetched(true);
        setLoading(false);
        return;
      }

      const response = await fetchMeetingMinutes(id.toString());
      if (response.data) {
        setResult(response.data);
        setIsDataFetched(true);
      } else {
        toast.error("No results found for this transcription.", {
          duration: 5000,
        });
        message.error("No results found for this transcription.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching meeting minutes.", {
        duration: 5000,
      });
      message.error("An error occurred while fetching meeting minutes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingMinutesData();
    setCurrentMeetingId(id);
  }, [id]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        result && (
          <div className="flex flex-col space-y-4 p-6 flex-1 mb-4 bg-black text-white-1 xl:ml-[16rem] h-full overflow-y-auto .hide-scrollable ">
            <div className="flex items-center justify-between">
              {/* Left Button */}
              <Tooltip title="View Recording Details">
                <button
                  onClick={() => router.push(`/result/${result?.recording_id}`)}
                  className="text-white-1 hover:text-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </Tooltip>

              {/* Right-Aligned Download Button */}
              <div className="my-4 md:my-0">
                <Tooltip title="Download">
                  <div className="flex gap-3 flex-row ml-auto">
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <HiDownload
                        className="h-7 w-7 text-gray-50"
                        onClick={() =>
                          generateMOMDOCXFile(result?.meeting_minutes)
                        }
                      />
                    </div>
                  </div>
                </Tooltip>
              </div>
            </div>

            <div>
              Number of speakers
              <span className="m-5 font-bold text-2xl text-blue-500">
                {result?.meeting_minutes?.no_of_speakers}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full sm:w-[50%]">
                <h3 className="text-lg font-semibold mb-3 text-white-1">
                  Attendees
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result?.meeting_minutes?.attendees.map(
                    (attendee: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-500 text-gray-900 text-sm font-medium rounded"
                      >
                        {attendee}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full sm:w-[50%]">
                <h3 className="text-lg font-semibold mb-3 text-white-1">
                  Important Dates
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result?.meeting_minutes?.imp_dates?.length > 0 ? (
                    result?.meeting_minutes?.imp_dates.map(
                      (date: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-500 text-black-1 text-sm font-medium rounded"
                        >
                          {date}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-sm text-gray-400">
                      No important dates available
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full">
              <h3 className="text-lg font-semibold mb-3 text-white-500">
                Key Events
              </h3>
              <div className="flex flex-wrap gap-2">
                {result?.meeting_minutes?.key_events.length > 0 ? (
                  result?.meeting_minutes?.key_events.map(
                    (event: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-500 text-gray-900 text-sm font-medium rounded"
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

            <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full">
              <h3 className="text-lg font-semibold mb-3 text-white-1">
                Summary
              </h3>
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
