import Typography from "@/modules/teiki-ui/components/Typography";

export type ForwardedProps = Omit<
  React.ComponentProps<typeof Typography.Div> &
    React.ComponentProps<typeof Typography.Span>,
  "content" | "children"
>;
