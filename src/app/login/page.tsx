"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Client, Account } from "appwrite";

const { Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const client = new Client().setProject("673c7a97003852ac5aea");

  const account = new Account(client);

  const handleSubmit = () => {
    const promise = account.createEmailPasswordSession(username, password);

    promise.then(
      function (response) {
        console.log(response); // Success
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  };

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    // Here you would typically handle the login logic
    console.log("Login attempted with:", values);
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    // For demonstration, we'll just log the attempt and redirect
    // router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">
            Welcome Back
          </Title>
          <p className="text-gray-600">
            Please enter your credentials to login
          </p>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Username"
              size="large"
              className="rounded-md"
              onChange={(e: any) => setUsername(e?.target?.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              size="large"
              className="rounded-md"
              onChange={(e: any) => setPassword(e?.target?.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 focus:bg-blue-600"
              size="large"
              loading={loading}
              onClick={() => handleSubmit()}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center">
          <a href="#" className="text-blue-500 hover:text-blue-600">
            Forgot password?
          </a>
        </div>
      </Card>
    </div>
  );
}
