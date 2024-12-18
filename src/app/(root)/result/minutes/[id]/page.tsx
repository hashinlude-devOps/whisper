"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchMeetingMinutes,
  viewMeetingMinutes,
} from "@/lib/services/audioService";
import { Button, message, Tooltip } from "antd";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { HiDownload } from "react-icons/hi";
import { generateMOMDOCXFile } from "@/components/PdfGenerator";
import { useSidebar } from "@/context/ContextProvider";

export default function MeetingMinutes() {
  const [result, setResult] = React.useState<any>(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const { setCurrentMeetingId } = useSidebar();

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

  const handleRegenerate = async () => {
    if (!id) {
      message.error("Invalid meeting ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchMeetingMinutes(id.toString());
      if (response?.data) {
        setResult(response.data);
      } else {
        toast.error("No results found for this transcription.", {
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error("An error occurred while regenerating meeting minutes.", {
        duration: 5000,
      });
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
          <div className="flex flex-col space-y-4 p-6 flex-1 mb-4 bg-black text-white-1 xl:ml-[16rem] h-full overflow-y-auto .hide-scrollable">
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
                <div className="flex gap-3 flex-row">
                  <Button
                    className="text-white-1 border-none bg-blue-600 hover:bg-blue-700"
                    onClick={handleRegenerate}
                  >
                    Regenerate
                  </Button>
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
            </div>

            {/* Attendees & Important Dates */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full sm:w-[50%]">
                <h3 className="text-lg font-semibold mb-3 text-white-1">
                  Attendees
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result?.meeting_minutes?.attendees.map(
                    (attendee: any, index: any) => (
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
                  {result?.meeting_minutes?.imp_dates.length > 0 ? (
                    result?.meeting_minutes?.imp_dates.map(
                      (date: any, index: any) => (
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

            {/* Key Events */}
            <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full">
              <h3 className="text-lg font-semibold mb-3 text-white-1">
                Key Events
              </h3>
              <div className="flex flex-wrap gap-2">
                {result?.meeting_minutes?.key_events.length > 0 ? (
                  result?.meeting_minutes?.key_events.map(
                    (event: any, index: any) => (
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

            {/* Meeting Introduction (Starts With) */}
            <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full">
              <h3 className="text-lg font-semibold mb-3 text-white-1">
                Meeting Introduction
              </h3>
              <div className="text-sm">
                {result?.meeting_minutes?.starts_with ? (
                  <p>{result?.meeting_minutes?.starts_with}</p>
                ) : (
                  <p className="text-gray-400">No introduction available</p>
                )}
              </div>
            </div>

            {/* Conclusions Section */}
            <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full">
              <h3 className="text-lg font-semibold mb-3 text-white-1">
                Conclusions
              </h3>
              <div className="text-sm">
                {result?.meeting_minutes?.conclusions ? (
                  <p>{result?.meeting_minutes?.conclusions}</p>
                ) : (
                  <p className="text-gray-400">No conclusions available</p>
                )}
              </div>
            </div>

            {/* Next Actions */}
            <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full">
              <h3 className="text-lg font-semibold mb-3 text-white-1">
                Next Actions
              </h3>
              {result?.meeting_minutes?.next_actions?.length > 0 ? (
                <ul className="list-disc pl-5 text-sm">
                  {result?.meeting_minutes?.next_actions.map(
                    (action:any, index:any) => (
                      <li key={index} className="text-gray-300">
                        {action}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-gray-400">No next actions available</p>
              )}
            </div>

            {/* Promises Given */}
            <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full">
              <h3 className="text-lg font-semibold mb-3 text-white-1">
                Promises Given
              </h3>
              {result?.meeting_minutes?.promises_given?.length > 0 ? (
                <ul className="list-disc pl-5 text-sm">
                  {result?.meeting_minutes?.promises_given.map(
                    (promise:any, index:any) => (
                      <li key={index} className="text-gray-300">
                        {promise}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-gray-400">No promises given</p>
              )}
            </div>

            {/* What To Do */}
            <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full">
              <h3 className="text-lg font-semibold mb-3 text-white-1">
                To Do
              </h3>
              {result?.meeting_minutes?.what_to_do?.length > 0 ? (
                <ul className="list-disc pl-5 text-sm">
                  {result?.meeting_minutes?.what_to_do.map((todo:any, index:any) => (
                    <li key={index} className="text-gray-300">
                      {todo}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No tasks available</p>
              )}
            </div>

            {/* Summary Section */}
            <div className="p-4 bg-black-1 rounded-lg shadow-lg w-full">
              <h3 className="text-lg font-semibold mb-3 text-white-500">
                Summary
              </h3>
              <div className="text-sm">
                {result?.meeting_minutes?.summary ? (
                  <p>{result?.meeting_minutes?.summary}</p>
                ) : (
                  <p className="text-gray-400">No summary available</p>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}
