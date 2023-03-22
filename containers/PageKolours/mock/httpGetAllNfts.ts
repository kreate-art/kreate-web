import { Nft } from "../kolours-types";

import layer0 from "./00.72926E.png";
import layer1 from "./01.225B70.png";
import layer2 from "./02.2DA8A7.png";
import layer3 from "./03.E2513B.png";
import layer4 from "./04.F39743.png";
import layer5 from "./05.332037.png";
import layer6 from "./06.78364D.png";
import layer7 from "./07.EAD6A3.png";
import layer8 from "./08.C34574.png";
import grayscale from "./grayscale.png";

import { sleep } from "@/modules/async-utils";

type Response = {
  nfts: Nft[];
};

export async function httpGetAllNfts(): Promise<Response> {
  await sleep(1000);
  return {
    nfts: [
      {
        id: "2802c300-169b-41a7-bd66-afe3df3e0d1d",
        grayscaleImage: grayscale,
        palette: [
          { image: layer0, color: "#72926E", minted: false },
          { image: layer1, color: "#225B70", minted: false },
          { image: layer2, color: "#2DA8A7", minted: false },
          { image: layer3, color: "#E2513B", minted: false },
          { image: layer4, color: "#F39743", minted: false },
          { image: layer5, color: "#332037", minted: false },
          { image: layer6, color: "#78364D", minted: false },
          { image: layer7, color: "#EAD6A3", minted: false },
          { image: layer8, color: "#C34574", minted: false },
        ],
      },
      {
        id: "ffcde3e2-2622-4fd0-9bd2-7523f0cc20a3",
        grayscaleImage: grayscale,
        palette: [
          { image: layer8, color: "#C34574", minted: false },
          { image: layer7, color: "#EAD6A3", minted: false },
          { image: layer6, color: "#78364D", minted: false },
          { image: layer5, color: "#332037", minted: false },
          { image: layer4, color: "#F39743", minted: false },
          { image: layer3, color: "#E2513B", minted: false },
          { image: layer2, color: "#2DA8A7", minted: false },
          { image: layer1, color: "#225B70", minted: false },
          { image: layer0, color: "#72926E", minted: false },
        ],
      },
    ],
  };
}
