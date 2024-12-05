export const getSegmentAudio = async (segmentUrl: string): Promise<string> => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  
      // Ensure the base URL ends with a single slash and the segment URL starts cleanly
      const fullUrl = new URL(segmentUrl, `${API_BASE_URL}/`).toString();
  
      // Retrieve the access token
      const accessToken = localStorage.getItem("access_token");
  
      // Prepare headers with the authorization token
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
  
      // Convert response to a Blob
      const blob = await response.blob();
      return URL.createObjectURL(blob); 
    } catch (error) {
      console.error("Error fetching segment audio:", error);
      return "";
    }
  };
  
  

  export const getFullAudio = async (id: string): Promise<string> => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  
      // Ensure the base URL ends with a single slash and the segment URL starts cleanly
      const fullUrl = new URL(id, `${API_BASE_URL}/download-audio/`).toString();
  
      // Retrieve the access token
      const accessToken = localStorage.getItem("access_token");
  
      // Prepare headers with the authorization token
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
  
      // Convert response to a Blob
      const blob = await response.blob();
      return URL.createObjectURL(blob); 
    } catch (error) {
      console.error("Error fetching segment audio:", error);
      return "";
    }
  };
  
  