"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Input, Button } from "antd";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

function Login() {
  const router = useRouter();
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = React.useState(false);

  const formik: any = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validateOnChange: false,
    validate: (values) => {
      const errors: any = {};
      if (!values.email) {
        errors.email = "email is required";
      }
      if (!values.password) {
        errors.password = "Password is required";
      }
      return errors;
    },
    onSubmit: async (values: any) => {
      setIsLoading(true);
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
          // callbackUrl: "/dashboard",
        });

        res?.ok &&
          toast.success("Login", {
            position: "top-right",
            description: "Login Successfull",
            duration: 5000,
          });

        if (res === undefined || res.ok === false) {
          setIsLoading(false);
          let description =
            "There was an error while logging in. Please try again.";
          if (res?.status === 401) {
            description = "Invalid email or password";
          }
          toast.error("Login", {
            position: "top-right",
            description: description,
            duration: 5000,
          });
        }
      } catch (error) {
        toast.error("Login", {
          position: "top-right",
          description: "There was an error while logging in. Please try again.",
          duration: 5000,
        });
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div
      className="h-screen bg-slate-400"
      // style={{
      //   backgroundImage: "url('/image/road.jpg')",
      //   backgroundSize: "cover",
      //   backgroundRepeat: "no-repeat",
      //   backgroundPosition: "center",
      // }}
    >
      <div className="bg-[black]/60 h-[100%] w-[100%] p-[2rem]">
        <div className="md:flex justify-center">
          <div className="text-[white] md:w-[30%] backdrop-blur-3xl h-[90vh] rounded-[16px] p-[2rem] flex flex-col justify-center items-center ">
            <div className="text-[44px] font-[500]">Login</div>

            <div className="mt-[1.5rem] w-[100%]">
              <Input
                id="email"
                placeholder="Enter email"
                className="h-[2.5rem]  bg-[white]/25 text-white border border-[white]/25"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <p className="text-red-700 text-sm mt-2 ml-2">
                {formik.errors.email ?? null}
              </p>
            </div>
            <div className="mt-[1.5rem] w-full">
              <Input.Password
                id="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Enter the password"
                className="h-[2.5rem]  bg-[white]/25 text-white border border-[white]/25"
              />
              <p className="text-red-700 text-sm mt-2 ml-2">
                {formik.errors.password ?? null}
              </p>
            </div>
            <div className="w-[100%]">
              <Button
                className="bg-[#C6C7F8] mt-[1.5rem] h-[2.5rem] w-[100%]"
                onClick={() => formik.handleSubmit()}
                loading={isLoading}
              >
                Sign In
              </Button>
            </div>
            <div className="flex gap-[1rem] mt-[1.5rem]">
              <Link
                href="/forgot-password"
                className="text-[12px] font-[400] text-[#C6C7F8]"
              >
                Forget Password
              </Link>
            </div>

            <div className="text-white text-[10px] font-light text-center absolute inset-x-0 bottom-[1rem]">
              © 2024 Whisper
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

Login.unauth = true;
