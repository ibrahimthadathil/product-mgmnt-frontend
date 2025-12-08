"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@/schema/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { userSignUp } from "@/api/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SignUpFormProps {
  onSubmit?: (data: SignUpInput) => void | Promise<void>;
}

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: SignUpInput) => {
    if (onSubmit) {
      await onSubmit(data);
      return;
    }

    setIsLoading(true);
    try {
      const result = await userSignUp({
        userName: data.username,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      } else {
        toast.error(result.message || "Failed to create account");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "An error occurred during sign up"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="signup-username">Username</Label>
              <FormControl>
                <Input id="signup-username" placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="signup-email">Email</Label>
              <FormControl>
                <Input
                  id="signup-email"
                  placeholder="you@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="signup-password">Password</Label>
              <FormControl>
                <Input
                  id="signup-password"
                  placeholder="••••••"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
