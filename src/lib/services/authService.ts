import { apiClient } from '@/lib/apiClient';


interface SigninPayload {
  email: string;
  password: string;
}

interface SignupPayload extends SigninPayload {
  name: string;
  confirm_password: string;
}

interface Response {
    data: any; 
    status:any;
  }
  

  export const signin = async (payload: SigninPayload): Promise<Response> => {
    try {
      const response = await apiClient<Response>('/login', {
        method: 'POST',
        body: payload,
      });
  
      // Return the response for consistent handling
      return response;
    } catch (error: any) {
      console.error('Signin error:', error);
      throw error; // Rethrow the error to be handled in the UI
    }
  };
  
  export const signup = async (payload: SignupPayload): Promise<Response> => {
    try {
      const response = await apiClient<Response>('/signup', {
        method: 'POST',
        body: payload,
      });
  
      // Return the response for consistent handling
      return response;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error; // Rethrow the error to be handled in the UI
    }
  };
