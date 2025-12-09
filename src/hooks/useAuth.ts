// import { userSignIn, userSignUp } from "@/api/authApi";
// import {  signInSchema, signUpSchema } from "@/schema/authSchema";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { UseRMutation } from "./useMutation";
// import { Iuser } from "@/types/types";
// import { signIn } from "next-auth/react";
// import { UseHookForm } from "./useForm";

// export const useAuth = (isSignup: boolean) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const schema:any = isSignup ? signUpSchema : signInSchema;
//   const api = isSignup ? userSignUp : userSignIn;

//   const {mutate,isPending,} = UseRMutation(
//     "auth",
//     api,
//     "auth",
//     async (data: {
//       message: string;
//       user: Iuser;
//       success: boolean;
//       accessToken: string;
//     }) => {
//       console.log(data,'00');
      
//       setIsLoading(true)
//       await signIn("credentials", {
//         email: data.user.email,
//         name:(data.user as any).name,
//         role:data.user.role,
//         token:data.accessToken,
//         redirect: false,
//         // callbackUrl: "/shop",
//       })
//       setIsLoading(false)
//       router.push('/shop')
//     }
//   );
//   const {form,onFormSubmit,errors} = UseHookForm(schema,(data:any)=>mutate(data))

//   return { form, onFormSubmit, isLoading };
// };


import { userSignIn, userSignUp } from "@/api/authApi";
import { signInSchema, signUpSchema } from "@/schema/authSchema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UseRMutation } from "./useMutation";
import { Iuser } from "@/types/types";
import { signIn } from "next-auth/react";
import { UseHookForm } from "./useForm";

export const useAuth = (isSignup: boolean) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const schema: any = isSignup ? signUpSchema : signInSchema;
  const api = isSignup ? userSignUp : userSignIn;

  const { mutate, isPending } = UseRMutation(
    "auth",
    api,
    "auth",
    async (data: {
      message: string;
      user: Iuser;
      success: boolean;
      accessToken: string;
    }) => {
      console.log(data, '00');
      
      setIsLoading(true);
      
      try {
        const result = await signIn("credentials", {
          email: data.user.email,
          name: (data.user as any).name,
          role: data.user.role,
          token: data.accessToken,
          redirect: false,
        });

        console.log('SignIn result:', result);

        if (result?.error) {
          console.error('SignIn error:', result.error);
          setIsLoading(false);
          return;
        }

        if (result?.ok) {
          // Small delay to ensure session is set
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/shop');
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  );
  
  const { form, onFormSubmit, errors } = UseHookForm(schema, (data: any) => mutate(data));

  return { form, onFormSubmit, isLoading };
};