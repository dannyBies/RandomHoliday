import { BackgroundSlider } from "@/components/BackgroundSlider";
import Image from "next/image";
import { City } from "@/components/City";
import cities from "./../cities.json";
import { HolidayInformation } from "@/components/HolidayInformation";

export const runtime = "edge";

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

const cityList = cities as City[];
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const selectedCity = cityList.find((city) => {
    return city.name === searchParams["city"] && city.countryCode === searchParams["country"];
  });
  return (
    <main>
      <BackgroundSlider images={images}>{<HolidayInformation city={selectedCity} />}</BackgroundSlider>
    </main>
  );
}
