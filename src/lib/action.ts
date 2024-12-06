export async function getLoggedInUser() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          return accessToken;
        } else {
          return null;
        }
      } else {
        // If localStorage is not available, return null or handle accordingly
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  