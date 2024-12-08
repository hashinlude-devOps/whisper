"use client";
import React, { useState, useRef } from "react";
import { message, Button, Modal, Input } from "antd";

import { getFullAudio } from "@/lib/services/audiofetchService";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import CustomAudioPlayer from "./CustomAudioPlayer";
import Loader from "@/components/Loader";
import {
  getTranscription,
  updateRecordingName,
  updateSpeakerNames,
} from "@/lib/services/audioService";
import CalendarIcon from "@heroicons/react/20/solid/CalendarIcon";
import ClockIcon from "@heroicons/react/20/solid/ClockIcon";

import { useParams, useRouter } from "next/navigation";

import { nullable } from "zod";

const AudioResultComponent = ({ id }: { id: number }) => {
  const params = useParams();
  const idParams = Number(params?.id);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [result, setResult] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(true);
  const [speakerNameUpdates, setSpeakerNameUpdates] = useState<
    Record<string, string>
  >({});
  const [currentAudioTime, setCurrentAudioTime] = useState(0);

  const [noOfSpeakers, setNoOfSpeakers] = React.useState<any>();
  const [speakerValue, setSpeakerValue] = React.useState([{}]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [isFileNameEdit, setIsFileNameEdit] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const router = useRouter();
  const hasFetchedAudio = useRef(false);

  React.useEffect(() => {
    setNoOfSpeakers(result?.speaker_list);
  }, [result]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const formatTime = (ms: number) => {
    const date = new Date(ms * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const fetchAudioData = async () => {
    if (hasFetchedAudio.current) return;

    setLoadingAudio(true);
    try {
      const url = await getFullAudio(id.toString());
      setAudioUrl(url);
      hasFetchedAudio.current = true;

      const response = await getTranscription(id.toString());

      const fetchedResult = response.data.result;

      if (fetchedResult) {
        setResult(fetchedResult);
      } else {
        message.error("No results found for this transcription.");
      }
    } catch (error) {
      console.error("Error fetching full audio:", error);
    } finally {
      setLoadingAudio(false);
    }
  };

  React.useEffect(() => {
    fetchAudioData();
  }, []);

  const handleSpeakerEdit = () => {
    setIsLoading(true);
    updateSpeakerNames(result?.json_file, speakerValue)
      .then(async () => {
        const response = await getTranscription(id.toString());
        const fetchedResult = response.data.result; // TODO : REFACTOR REFETCH
        if (fetchedResult) {
          setResult(fetchedResult);
        } else {
          message.error("No results found for this transcription.");
        }
        setIsLoading(false);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating speaker names:", error);
        setIsLoading(false);
      });

    setIsLoading(false);
  };

  const handleFilenameChange = async () => {
    if (fileName != null && fileName != "") {
      await updateRecordingName(id.toString(), fileName);
      const response = await getTranscription(id.toString());
      const fetchedResult = response.data.result; // TODO : REFACTOR REFETCH
      if (fetchedResult) {
        setResult(fetchedResult);
      } else {
        message.error("No results found for this transcription.");
      }
      setFileName(null);
    }
  };

  // const handleKeyDown = (
  //   e: React.KeyboardEvent<HTMLSpanElement>,
  //   speakerIndex: number,
  //   jsonPath: string
  // ) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     const newValue = e.currentTarget.innerText.trim();
  //     if (newValue) {
  //       handleSpeakerEdit(speakerIndex, newValue, jsonPath);
  //     }
  //   }
  // };

  const handleAudioTimeUpdate = (time: number) => {
    setCurrentAudioTime(time);
  };

  return (
    <div
      onClick={() => setOpenDropdownIndex(null)}
      className="flex flex-col min-h-screen"
    >
      <div className="flex flex-col space-y-4 px-[2rem] flex-1 mb-4">
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
          <div className=" bg-white ">
            <div className="flex items-center space-x-2 mt-2 py-4">
              {!isFileNameEdit ? (
                <span
                  className="text-sm text-gray-700 font-bold"
                  onKeyDown={async (e) => await handleFilenameChange()}
                >
                  {result?.recordingname}
                  {/* TODO : Confirm recording name is required */}
                </span>
              ) : (
                <Input
                  className="w-full"
                  value={fileName ?? result?.recordingname}
                  onChange={(e: any) => setFileName(e.target.value)}
                />
              )}
              {!isFileNameEdit && (
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => setIsFileNameEdit(true)}
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
              )}
              {isFileNameEdit && (
                <>
                  <Button
                    className="text-white  bg-blue-500"
                    onClick={async () => {
                      await handleFilenameChange();
                      setIsFileNameEdit(false);
                    }}
                  >
                    save
                  </Button>
                  <Button
                    className="text-white  bg-red-500"
                    onClick={() => setIsFileNameEdit(false)}
                  >
                    cancel
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  27/11/2024, 15:32:38
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">0:26</span>
              </div>
            </div>
          </div>
          <div className="my-4 md:my-0">
            <div className="flex gap-3 flex-row">
              <Button className="bg-black text-white" onClick={showModal}>
                Edit Speaker
              </Button>
              <Button
                className="bg-black text-white"
                onClick={() => router.push(`/result/minutes/${id}`)}
              >
                Meeting Minutes
              </Button>
            </div>

            <Modal
              title="Edit Speaker"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={(_, { OkBtn, CancelBtn }) => (
                <>
                  <Button className="bg-slate-200" onClick={showModal}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-black text-white"
                    onClick={() => handleSpeakerEdit()}
                    loading={isLoading}
                  >
                    Edit
                  </Button>
                </>
              )}
            >
              <div>
                {noOfSpeakers?.map((item: any, index: number) => (
                  <div className="mt-[0.5rem]" key={index}>
                    <div className="font-semibold">{item}</div>
                    <div>
                      <Input
                        placeholder={`Enter ${item} name`}
                        onChange={(e) => {
                          setSpeakerValue((prev: any[]) => ({
                            ...prev,
                            [item]: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Modal>
          </div>
        </div>

        {/* Table Container with Scrollable Content */}
        <div className="mt-4 overflow-y-auto max-h-[calc(100vh-160px)] hide-scrollable">
          <table className="min-w-full table-auto">
            <tbody>
              {result?.result?.map((segment: any, index: any) => {
                const startTime = segment.start_time;
                const endTime = segment.end_time;
                const elapsedTime = formatTime(index === 0 ? 0 : startTime);
                const bufferTime = 0.3; // Add a small buffer time (in seconds)
                const isHighlighted =
                  currentAudioTime >= startTime - bufferTime &&
                  currentAudioTime <= endTime + bufferTime;

                return (
                  <tr
                    key={index}
                    className={`table-row transition-colors duration-300 ${
                      isHighlighted ? "bg-gray-200" : "hover:bg-gray-200"
                    }`}
                  >
                    <td className="px-4 py-2">{elapsedTime}</td>
                    <td className="px-4 py-2">{segment.speaker}</td>
                    {/* <td className="px-4 py-2">
                      <audio
                        controls
                        className="md:my-0 sm:my-[1rem] my-[1rem]"
                      >
                        <source
                          src={`http://44.223.235.101:5000/${segment?.segment_file}`}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </td> */}

                    <td className="px-4 py-2">{segment.transcribed_text}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {loadingAudio ? (
        <Loader />
      ) : (
        audioUrl && (
          <div className="sticky bottom-0 w-full bg-white shadow-lg">
            <div className="max-w-full w-full">
              <CustomAudioPlayer
                audioUrl={audioUrl}
                onTimeUpdate={handleAudioTimeUpdate}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AudioResultComponent;
