<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import {
  Alert as AAlert,
  Button as AButton,
  Form as AForm,
  FormItem as AFormItem,
  Input as AInput,
  InputPassword as AInputPassword,
  message,
} from "ant-design-vue";
import { computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import { login } from "../api/auth";
import { useAuthStore } from "../stores/authStore";

type LoginFormValues = {
  email: string;
  password: string;
};

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const mutation = useMutation({ mutationFn: login });
const form = reactive<LoginFormValues>({
  email: "admin@lumadock.local",
  password: "admin123",
});
const isPending = computed(() => mutation.isPending.value);

async function onFinish(values: LoginFormValues) {
  try {
    const response = await mutation.mutateAsync(values);
    auth.setSession(response);
    void message.success(`Welcome back, ${response.user.name}.`);
    const redirect =
      typeof route.query.redirect === "string"
        ? route.query.redirect
        : "/admin";
    await router.replace(redirect);
  } catch {
    void message.error(
      "Login failed. Check the local API and demo credentials.",
    );
  }
}
</script>

<template>
  <section class="page-section">
    <div
      class="mx-auto grid max-w-[520px] gap-6 rounded-ui border border-line bg-surface p-6 shadow-soft"
    >
      <div class="section-heading !mb-0">
        <span class="eyebrow">JWT Demo Auth</span>
        <h1 class="!text-4xl">Login</h1>
        <p>Use a local demo account to unlock protected routes.</p>
      </div>

      <AAlert
        show-icon
        message="Demo accounts"
        description="admin@lumadock.local / admin123, viewer@lumadock.local / viewer123"
        type="info"
      />

      <AAlert
        v-if="mutation.isError.value"
        show-icon
        message="Login failed"
        description="Check the local FastAPI server and demo credentials."
        type="error"
      />

      <AForm
        layout="vertical"
        :model="form"
        :required-mark="false"
        @finish="onFinish"
      >
        <AFormItem
          label="Email"
          name="email"
          :rules="[{ required: true, message: 'Email is required.' }]"
        >
          <AInput v-model:value="form.email" autocomplete="username" />
        </AFormItem>

        <AFormItem
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Password is required.' }]"
        >
          <AInputPassword
            v-model:value="form.password"
            autocomplete="current-password"
          />
        </AFormItem>

        <AButton block html-type="submit" :loading="isPending" type="primary"
          >Login</AButton
        >
      </AForm>
    </div>
  </section>
</template>
