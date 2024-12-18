import { apiClient } from "../apiClient";

export const getSegmentAudio = async (segmentUrl: string): Promise<string> => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL  
      const fullUrl = new URL(segmentUrl, `${API_BASE_URL}/`).toString();  
      const accessToken = localStorage.getItem("access_token");  
      const headers: HeadersInit = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
  
      const response = await fetch(fullUrl, {
        method: "GET",
        headers,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch audio from ${fullUrl}`);
      }  
      const blob = await response.blob();
      return URL.createObjectURL(blob); 
    } catch (error) {
      // console.error("Error fetching segment audio:", error);
      return "";
    }
  };

  export const getFullAudio = async (id: string): Promise<string> => {
    try {
      const endpoint = `/download-audio/${id}`; 
      const response = await apiClient<string>(endpoint, {
        method: "GET",
      });
  
      if (response.status === 200) {
        const audioUrl = URL.createObjectURL(new Blob([response.data]));
        return audioUrl;
      } else {
        throw new Error(`Failed to fetch audio from ${endpoint}`);
      }
    } catch (error) {
      // console.error("Error fetching full audio:", error);
      return "";
    }
  };
  
  