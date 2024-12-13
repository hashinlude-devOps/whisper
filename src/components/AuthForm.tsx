"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

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
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);

    try {
      if (isSignin) {
        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          setUploadStatus("Incorrect email or password.");
          toast.error(result.error);
        } else {
          toast.success("Login successful!");
          router.push("/");
        }
      } else {
        const response = await signup(values);

        if (response.status === 200) {
          toast.success("Registration successful! Please log in.");
          router.push("/sign-in");
        } else {
          setUploadStatus(response.data?.error);
          toast.error(`${response.data?.error}`, {
            duration: 5000,
          });
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <Loader />} {/* This will display the loader */}
      <div className="w-full max-w-lg bg-black-3 bg-opacity-10 backdrop-filter backdrop-blur-lg border border-gray-50 border-opacity-25 rounded-lg p-8 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-4 text-white-1">
              {isSignin ? "Log In" : "Sign Up"}
            </h1>

            {!isSignin && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white-1">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-gray-600 bg-opacity-20 border-gray-300 text-white-1 placeholder-gray-300 focus:ring focus:ring-blue-500"
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
                  <FormLabel className="text-white-1">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="bg-gray-600 bg-opacity-20 border-gray-300 text-white-1 placeholder-gray-300 focus:ring focus:ring-blue-500"
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
                  <FormLabel className="text-white-1">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="bg-gray-600 bg-opacity-20 border-gray-300 text-white-1 placeholder-gray-300 focus:ring focus:ring-blue-500"
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
                    <FormLabel className="text-white-1">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="bg-gray-600 bg-opacity-20 border-gray-300 text-white-1 placeholder-gray-300 focus:ring focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full text-white-1 border-none bg-blue-600 hover:bg-blue-700"
            >
              {isSignin ? "Log In" : "Sign Up"}
            </Button>
            {uploadStatus && (
              <p className="mt-4 text-sm text-red-600">{uploadStatus}</p>
            )}

            <p className="text-gray-50 text-center">
              {isSignin ? "Don't have an account?" : "Already have an account?"}
              <Link
                href={isSignin ? "/sign-up" : "/sign-in"}
                className="ml-2 text-blue-600 hover:text-blue-700"
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
