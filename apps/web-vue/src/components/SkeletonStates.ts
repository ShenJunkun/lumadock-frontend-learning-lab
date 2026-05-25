import { Skeleton } from "ant-design-vue";
import { defineComponent, h } from "vue";

export const ProductGridSkeleton = defineComponent({
  name: "ProductGridSkeleton",
  props: {
    count: {
      type: Number,
      default: 3,
    },
    label: {
      type: String,
      default: "Loading products",
    },
  },
  setup(props) {
    return () =>
      h(
        "div",
        {
          "aria-label": props.label,
          class: "product-grid catalog-grid skeleton-state",
        },
        Array.from({ length: props.count }, (_, index) =>
          h("article", { class: "product-card skeleton-card", key: index }, [
            h(Skeleton.Image, { active: true, class: "skeleton-media" }),
            h("div", { class: "product-card-body" }, [
              h(Skeleton, {
                active: true,
                paragraph: { rows: 3 },
                title: true,
              }),
            ]),
          ]),
        ),
      );
  },
});

export const RouteSkeleton = defineComponent({
  name: "RouteSkeleton",
  setup() {
    return () =>
      h("section", { class: "page-section route-skeleton", role: "status" }, [
        h(Skeleton, { active: true, paragraph: { rows: 6 }, title: true }),
      ]);
  },
});

export const ProductDetailSkeleton = defineComponent({
  name: "ProductDetailSkeleton",
  setup() {
    return () =>
      h("section", { class: "page-section route-skeleton", role: "status" }, [
        h(Skeleton, { active: true, paragraph: { rows: 8 }, title: true }),
      ]);
  },
});

export const BookingSkeleton = defineComponent({
  name: "BookingSkeleton",
  setup() {
    return () =>
      h("section", { class: "page-section route-skeleton", role: "status" }, [
        h(Skeleton, { active: true, paragraph: { rows: 8 }, title: true }),
      ]);
  },
});

export const AdminTableSkeleton = defineComponent({
  name: "AdminTableSkeleton",
  setup() {
    return () =>
      h("div", { class: "admin-skeleton", role: "status" }, [
        h(Skeleton, { active: true, paragraph: { rows: 8 }, title: true }),
      ]);
  },
});
