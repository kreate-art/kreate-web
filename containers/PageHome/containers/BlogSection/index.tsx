import Link from "next/link";
import * as React from "react";

import BlogContent from "./component/BlogContent";
import BlogTitle from "./component/BlogTitle";
import IconDocument from "./component/Icon/IconDocument";
import blog1 from "./images/blog1.webp";
import blog2 from "./images/blog2.png";
import blog3 from "./images/blog3.png";
import styles from "./index.module.scss";

import Carousel from "@/modules/teiki-components/components/Carousel";
import Button from "@/modules/teiki-ui/components/Button";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const BlogSection = ({ className, style }: Props) => {
  const blogList = [
    {
      title: "Teiki: A Decentralized Crowdfunding Protocol",
      picture: blog1,
      createdAt: 1671109200000,
      url: "https://teikinetwork.medium.com/teiki-a-decentralized-crowdfunding-protocol-f6a2a8d030ff",
      description:
        "The Cardano ecosystem has much room for development and certainly needs more builders. With Cardano’s Proof-of-Stake...",
    },
    {
      title: "AI integration on Teiki",
      picture: blog2,
      createdAt: 1672146000000,
      url: "https://teikinetwork.medium.com/ai-integration-on-teiki-814c71742337",
      description:
        "The co-evolution of humans and machines has been central to social advancement throughout history. With the rapid growth of AI...",
    },
    {
      title: "Open-sourcing the Teiki protocol",
      picture: blog3,
      createdAt: 1672405200000,
      url: "https://teikinetwork.medium.com/open-sourcing-the-teiki-protocol-7a94fd64e5a6",
      description:
        "At Teiki, we pursue transparency and open-source development, which brought us to the blockchain world. We are fully committed to...",
    },
  ];
  return (
    <div className={className} style={style}>
      <div className={styles.container}>
        <BlogTitle className={styles.title} />
        <Carousel className={styles.carousel} gap="medium" maxItemWidth={500}>
          {blogList.map((blog, index) => {
            if (index >= 3) return null;
            return (
              <BlogContent blog={blog} key={index} className={styles.blog} />
            );
          })}
        </Carousel>
        <Link
          className={styles.button}
          target="_blank"
          href="https://teikinetwork.medium.com"
        >
          <Button.Outline
            as="div"
            icon={<IconDocument />}
            content="All Articles"
          />
        </Link>
      </div>
    </div>
  );
};

export default BlogSection;
