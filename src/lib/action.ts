export async function getLoggedInUser() {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken){
        return accessToken;
      }
      else{
        return null;
      }
    } catch (error) {
      console.log(error)
      return null;
    }
  }