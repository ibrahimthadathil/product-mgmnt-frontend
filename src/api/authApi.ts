import instance from "@/utils/axiosInstance";

export const userSignIn = async (data: { email: string; password: string }) => {
  try {
    const result = await instance.post("/api/auth/signIn", data);

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const userSignUp = async (data:{email:string,password:string,userName:string})=>{
    try {
        const result = await instance.post('/api/auth/signup',data)
        return result.data
    } catch (error) {
        throw error
    }
}