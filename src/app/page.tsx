import { BackgroundSlider } from "@/components/BackgroundSlider";
import { HolidayCard } from "@/components/HolidayCard";
import Image from "next/image";
import { City } from "@/components/City";

const images = [
  <Image
    key="beach"
    src="/images/beach.jpg"
    alt="Beach"
    fill
    sizes="100vw"
    className="z-[-1] brightness-[0.67] object-cover"
  />,
  <Image
    key="city"
    src="/images/city.jpg"
    alt="City"
    fill
    sizes="100vw"
    className="z-[-1] brightness-[0.67] object-cover"
  />,
  <Image
    key="nature"
    src="/images/nature.jpg"
    alt="Nature"
    fill
    sizes="100vw"
    className="z-[-1] brightness-[0.67] object-cover"
  />,
  <Image
    key="hills"
    src="/images/hills.jpg"
    alt="Hills"
    fill
    sizes="100vw"
    className="z-[-1] brightness-[0.67] object-cover"
  />,
];

export default async function Home() {
  return (
    <main>
      <BackgroundSlider images={images}>
        <HolidayCard />
      </BackgroundSlider>
    </main>
  );
}
