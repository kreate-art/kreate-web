import useAdaHandle from "@/modules/common-hooks/hooks/useAdaHandle";
import InlineAddress from "@/modules/teiki-ui/components/InlineAddress";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  address: string;
};

export default function SupporterHandle({ address }: Props) {
  const { data, error } = useAdaHandle(address);
  if (error != null || data == undefined) {
    return (
      <Typography.Span size="heading6">
        <InlineAddress value={address} length="short" />
      </Typography.Span>
    );
  }
  return <Typography.Span size="heading6" content={`$${data}`} />;
}
