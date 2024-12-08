import { apiClient } from "@/lib/apiClient";

interface Response {
  data: any;
  status: any;
}

export const uploadAudio = async (
  audioFile: File | undefined,
  countOfSpeaker: number | undefined
): Promise<Response> => {
  const formData = new FormData();
  if (audioFile) {
    formData.append("audio", audioFile);
  }
  formData.append("num_speakers", countOfSpeaker?.toString() || "0");
  try {
    const response = await apiClient<Response>("/upload-audio", {
      method: "POST",
      body: formData,
    });

    return response;
  } catch (error) {
    console.error("Error uploading audio:", error);
    throw error;
  }
};

export const getRecordings = async (): Promise<Response> => {
  try {
    const response = await apiClient<Response>("/get-recordings", {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Error fetching recordings:", error);
    throw error;
  }
};

export const updateSpeakerNames = async (
  jsonPath: string,
  speakerNameUpdates: Record<string, string>
): Promise<Response> => {
  try {
    const response = await apiClient<Response>("/update-speaker-name", {
      method: "POST",
      body: {
        json_path: jsonPath,
        speaker_name_updates: speakerNameUpdates,
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating speaker names:", error);
    throw error;
  }
};

export const getTranscription = async (id: string): Promise<Response> => {
  try {
    const response = await apiClient<Response>(`/view-json/${id}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Error fetching recordings:", error);
    throw error;
  }
};

export const updateRecordingName = async (
  id: string,
  recordingName: string
): Promise<Response> => {
  try {
    const response = await apiClient<Response>("/update-recording-name", {
      method: "POST",
      body: {
        recording_id: id,
        new_recording_name: recordingName,
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating recording names:", error);
    throw error;
  }
};

export const fetchMeetingMinutes = async (id: string): Promise<Response> => {
  try {
    const response = await apiClient<Response>(
      `/generate-meeting-minutes/${id}`,
      {
        method: "GET",
      }
    );
    return response;
  } catch (error) {
    console.error("Error generating meeting minutes:", error);
    throw error;
  }
};
