import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import getLocation from "@/services/getLocation";

const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
});

interface LocationData {
  ip: string;
  location: {
    region: string;
    city: string;
    lat: number;
    lng: number;
  };
  timezone: string;
  isp: string;
}

export default function Home() {
  const [ip, setIp] = useState("");
  const [domain, setDomain] = useState("");
  const [validIP, setValidIP] = useState<boolean | null>(null);
  const [locationData, setLocationData] = useState<LocationData>({
    ip: "192.212.174.101",
    location: {
      region: "NY",
      city: "Brooklyn",
      lat: 40.7128,
      lng: -74.006,
    },
    timezone: "-05:00",
    isp: "SpaceX Starlink",
  });
  const [background, setBackground] = useState("");

  const handleRequest = async () => {
    if (validIP) {
      const response = await getLocation(ip, domain);
      if (response.ip === undefined) setValidIP(false);
      setLocationData(response);
    }
  };

  const ipDomainValidation = (ip: string) => {
    const ipRegex = new RegExp("^([0-9]{1,3}\\.){3}[0-9]{1,3}$", "g");
    const domainRegex = new RegExp(
      "^(www\\.)?([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\\.)+[a-zA-Z]{2,}$",
      "g"
    );

    if (domainRegex.test(ip)) {
      setDomain(ip);
      return true;
    }

    if (ipRegex.test(ip) || domainRegex.test(ip)) {
      return true;
    }
    setDomain("");
    return false;
  };

  useEffect(() => {
    if (ip === "") {
      setValidIP(null);
      return;
    }
    setValidIP(ipDomainValidation(ip));
  }, [ip]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setBackground(getBackgroundImage());
    window.addEventListener("resize", () => {
      setBackground(getBackgroundImage());
    });
  }, []);

  const getBackgroundImage = () => {
    if (window.innerWidth < 768) {
      return "/images/pattern-bg-mobile.png";
    }
    return "/images/pattern-bg-desktop.png";
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center gap-y-6 lg:gap-y-10 px-8 lg:px-0 relative">
      <div className="flex flex-col absolute z-10 top-0 left-0 w-full h-full">
        <div className="flex w-full h-[300px]">
          <Image
            src={background}
            alt="Pattern Background"
            width={10000}
            height={1000}
          />
        </div>
        <MapComponent
          position={[locationData.location.lat, locationData.location.lng]}
        />
      </div>

      <h1 className="mt-8 text-[32px] font-[500] z-20">IP Address Tracker</h1>
      <div className="flex w-full justify-center z-20">
        <input
          className={`w-full lg:w-[500px] h-[56px] text-[18px] rounded-l-xl p-4 outline-none text-black ${
            validIP === false && "border-red-500 border-2"
          } ${validIP === true && "border-green-600 border-2"}`}
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Search for any IP address or domain"
        />
        <button
          className="flex w-[48px] h-[56px] justify-center items-center bg-black hover:bg-veryDarkGray text-white rounded-r-xl"
          onClick={handleRequest}
        >
          <Image
            src="/images/icon-arrow.svg"
            alt="Search"
            width={12}
            height={12}
          />
        </button>
      </div>

      <div className="flex flex-col items-center w-full lg:flex-row lg:w-[80%] z-20 py-8 gap-y-4 bg-white rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-solid">
        <div className="flex flex-col lg:w-1/4 px-6 justify-center items-center lg:items-start gap-y-2">
          <h2 className="text-[14px] font-[500] text-darkGray">IP ADDRESS</h2>
          <p className="text-[16px] md:text-[24px] lg:text-[28px] font-[500] text-veryDarkGray break-all">
            {locationData.ip}
          </p>
        </div>

        <div className="flex flex-col lg:w-1/4 px-6 justify-center items-center lg:items-start gap-y-2">
          <h2 className="text-[14px] font-[500] text-darkGray">LOCATION </h2>
          <p className="text-[16px] md:text-[24px] lg:text-[28px] font-[500] text-veryDarkGray">
            {locationData.location.city}, {locationData.location.region}
          </p>
        </div>

        <div className="flex flex-col lg:w-1/4 px-6 justify-center items-center lg:items-start gap-y-2">
          <h2 className="text-[14px] font-[500] text-darkGray">TIME ZONE</h2>
          <p className="text-[16px] md:text-[24px] lg:text-[28px] font-[500] text-veryDarkGray">
            UTC {locationData.timezone}
          </p>
        </div>

        <div className="flex flex-col lg:w-1/4 px-6 justify-center items-center lg:items-start gap-y-2">
          <h2 className="text-[14px] font-[500] text-darkGray">ISP</h2>
          <p className="text-[16px] md:text-[24px] lg:text-[28px] font-[500] text-veryDarkGray">
            {locationData.isp}
          </p>
        </div>
      </div>
    </div>
  );
}
