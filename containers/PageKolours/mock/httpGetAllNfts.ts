import { faker } from "@faker-js/faker";

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
import original from "./original.png";

import { sleep } from "@/modules/async-utils";
import { GenesisKreationEntry } from "@/modules/kolours/types/Kolours";

type Response = {
  kreations: GenesisKreationEntry[];
};

export async function httpGetAllNfts(): Promise<Response> {
  await sleep(1000);
  return {
    kreations: [
      {
        id: "2802c300-169b-41a7-bd66-afe3df3e0d1d",
        initialImage: grayscale,
        finalImage: original,
        palette: [
          {
            image: layer0,
            kolour: "72926E",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer1,
            kolour: "225B70",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer2,
            kolour: "2DA8A7",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer3,
            kolour: "E2513B",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer4,
            kolour: "F39743",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer5,
            kolour: "332037",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer6,
            kolour: "78364D",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer7,
            kolour: "EAD6A3",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer8,
            kolour: "C34574",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
        ],
        fee: (Math.random() * 1e3) << 10,
        listedFee: (Math.random() * 1e3) << 10,
        status: "unready",
        createdAt: 1e9,
      },
      {
        id: "ffcde3e2-2622-4fd0-9bd2-7523f0cc20a3",
        initialImage: grayscale,
        finalImage: original,
        palette: [
          {
            image: layer8,
            kolour: "C34574",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer7,
            kolour: "EAD6A3",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer6,
            kolour: "78364D",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer5,
            kolour: "332037",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer4,
            kolour: "F39743",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer3,
            kolour: "E2513B",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer2,
            kolour: "2DA8A7",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer1,
            kolour: "225B70",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer0,
            kolour: "72926E",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
          {
            image: layer0,
            kolour: "926E72",
            status: faker.helpers.arrayElement(["free", "booked", "minted"]),
            fee: (Math.random() * 1e3) << 10,
            listedFee: (Math.random() * 1e3) << 10,
          },
        ],
        fee: (Math.random() * 1e3) << 10,
        listedFee: (Math.random() * 1e3) << 10,
        status: "unready",
        createdAt: 1e9,
      },
    ],
  };
}
