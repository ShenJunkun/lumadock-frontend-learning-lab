import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Form, Input, message } from "antd";
import type { Location } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginLocationState = {
  from?: Location;
};

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const mutation = useMutation({
    mutationFn: login,
  });

  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await mutation.mutateAsync(values);
      setSession(response);
      void message.success(`Welcome back, ${response.user.name}.`);
      const state = location.state as LoginLocationState | null;
      navigate(state?.from?.pathname ?? "/admin", { replace: true });
    } catch {
      void message.error("Login failed. Check the local API and demo credentials.");
    }
  };

  return (
    <section className="page-section">
      <div className="mx-auto grid max-w-[520px] gap-6 rounded-ui border border-line bg-surface p-6 shadow-soft">
        <div className="section-heading !mb-0">
          <span className="eyebrow">JWT Demo Auth</span>
          <h1 className="!text-4xl">Login</h1>
          <p>Use a local demo account to unlock protected routes.</p>
        </div>

        <Alert
          showIcon
          message="Demo accounts"
          description="admin@lumadock.local / admin123, viewer@lumadock.local / viewer123"
          type="info"
        />

        {mutation.isError && (
          <Alert
            showIcon
            message="Login failed"
            description="Check the local FastAPI server and demo credentials."
            type="error"
          />
        )}

        <Form<LoginFormValues>
          layout="vertical"
          requiredMark={false}
          initialValues={{ email: "admin@lumadock.local", password: "admin123" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required." }]}
          >
            <Input autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required." }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>

          <Button block htmlType="submit" loading={mutation.isPending} type="primary">
            Login
          </Button>
        </Form>
      </div>
    </section>
  );
}
