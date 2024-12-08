"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signin, signup } from "@/lib/services/authService";
import Loader from "./Loader";

type AuthType = "signin" | "signup";

const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const signupSchema = signinSchema
  .extend({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" }),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

const AuthForm = ({ initialType = "signin" }: { initialType?: AuthType }) => {
  const router = useRouter();
  const isSignin = initialType === "signin";

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(isSignin ? signinSchema : signupSchema),
    mode: "onBlur",
    shouldFocusError: false,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    try {
      const response = isSignin ? await signin(values) : await signup(values);

      // Check the status code directly
      if (response.status === 200) {
        // Handle successful response
        let access_token = response.data?.access_token;
        let name = response.data?.name;

        // Store the access token (or handle other logic)
        if (access_token) {
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("name", name);
        }

        toast.success(
          isSignin ? "Login successful!" : "Registration successful!",
          {
            duration: 5000,
          }
        );
        setTimeout(() => router.push(isSignin ? "/" : "/sign-in"));
      } else {
        toast.error("Something went wrong. Please try again.", {
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      toast.error(error.message || "Error occurred", {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <Loader />} {/* This will display the loader */}
      <div className="w-full max-w-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-gray-400 border-opacity-25 rounded-lg p-8 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-4 text-black">
              {isSignin ? "Log In" : "Sign Up"}
            </h1>

            {!isSignin && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white bg-opacity-20 border-gray-400 border-opacity-25 text-black placeholder-gray-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="bg-white bg-opacity-20 border-gray-400 border-opacity-25 text-black placeholder-gray-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="bg-white bg-opacity-20 border-gray-400 border-opacity-25 text-black placeholder-gray-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {!isSignin && (
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="bg-white bg-opacity-20 border-gray-400 border-opacity-25 text-black placeholder-gray-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-800 text-white"
            >
              {isSignin ? "Log In" : "Sign Up"}
            </Button>

            <p className="text-gray-500 text-center">
              {isSignin ? "Don't have an account?" : "Already have an account?"}
              <Link
                href={isSignin ? "/sign-up" : "/sign-in"}
                className="ml-2 text-gray-700 hover:text-gray-800"
              >
                {isSignin ? "Sign Up" : "Log In"}
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;
