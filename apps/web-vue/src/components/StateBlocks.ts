import { EmptyState as SharedEmptyState } from "@lumadock/ui-vue";
import { AlertCircle, Loader2, SearchX } from "lucide-vue-next";
import { defineComponent, h } from "vue";

export const LoadingState = defineComponent({
  name: "LoadingState",
  props: {
    message: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h("div", { class: "state-block", role: "status" }, [
        h(Loader2, {
          "aria-hidden": "true",
          class: "state-icon spin",
          size: 20,
        }),
        h("strong", props.title),
        h("span", props.message),
      ]);
  },
});

export const ErrorState = defineComponent({
  name: "ErrorState",
  props: {
    message: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h("div", { class: "state-block state-block-error", role: "alert" }, [
        h(AlertCircle, {
          "aria-hidden": "true",
          class: "state-icon",
          size: 20,
        }),
        h("strong", props.title),
        h("span", props.message),
      ]);
  },
});

export const EmptyState = defineComponent({
  name: "LocalEmptyState",
  props: {
    message: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(
        SharedEmptyState,
        {
          message: props.message,
          title: props.title,
        },
        {
          default: () => h(SearchX, { "aria-hidden": "true", size: 20 }),
        },
      );
  },
});
