import cx from "classnames";

import WithAspectRatio from "../../../../../../components/WithAspectRatio";

import styles from "./index.module.scss";

import { formatLovelaceAmount } from "@/modules/bigint-utils";
import { ProjectBenefitsTier } from "@/modules/business-types";
import { useDebounce } from "@/modules/common-hooks/hooks/useDebounce";
import ImageView from "@/modules/teiki-components/components/ImageView";
import RichTextViewer from "@/modules/teiki-components/components/RichTextViewer";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectBenefitsTier;
};

export default function TierPreview({ className, style, value }: Props) {
  const [value$Debounced] = useDebounce(value, { delay: 1000 });
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col padding="24px" gap="24px">
        <Typography.Div content="Tier Preview" size="heading6" />
        <Divider.Horizontal />
        <Typography.Div content={value.title} size="heading4" maxLines={1} />
        {value.banner == null ? null : (
          <div className={styles.bannerContainer}>
            <WithAspectRatio aspectRatio={16 / 9}>
              <ImageView
                className={styles.banner}
                src={value.banner.url}
                crop={{
                  x: value.banner.x,
                  y: value.banner.y,
                  w: value.banner.width,
                  h: value.banner.height,
                }}
              />
            </WithAspectRatio>
          </div>
        )}
        <Flex.Row gap="8px" alignItems="center">
          <Typography.Span
            content="Staking from"
            size="bodySmall"
            color="ink80"
          />
          <Typography.Span
            content={formatLovelaceAmount(value.requiredStake, {
              compact: true,
              includeCurrencySymbol: true,
            })}
            size="heading4"
            color="green"
          />
          <Typography.Span />
        </Flex.Row>
        <Divider.Horizontal />
        {!value$Debounced.contents ? null : (
          <RichTextViewer
            value={value$Debounced.contents.body}
            className={styles.richTextEditor}
          />
        )}
      </Flex.Col>
    </div>
  );
}
