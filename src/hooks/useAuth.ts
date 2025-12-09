import { userSignIn, userSignUp } from "@/api/authApi";
import {  signInSchema, signUpSchema } from "@/schema/authSchema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UseRMutation } from "./useMutation";
import { Iuser } from "@/types/types";
import { signIn } from "next-auth/react";
import { UseHookForm } from "./useForm";

export const useAuth = (isSignup: boolean) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const schema:any = isSignup ? signUpSchema : signInSchema;
  const api = isSignup ? userSignUp : userSignIn;

  const {mutate,isPending,} = UseRMutation(
    "auth",
    api,
    "auth",
    async (data: {
      message: string;
      user: Iuser;
      success: boolean;
      accessToken: string;
    }) => {
      console.log(data,'00');
      
      setIsLoading(true)
      await signIn("credentials", {
        email: data.user.email,
        name:(data.user as any).name,
        role:data.user.role,
        token:data.accessToken,
        redirect: true,
        callbackUrl: "/shop",
      })
      setIsLoading(false)
      router.push('/shop')
    }
  );
  const {form,onFormSubmit,errors} = UseHookForm(schema,(data:any)=>mutate(data))

  return { form, onFormSubmit, isLoading };
};
