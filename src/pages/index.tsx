"use client";
import { useState } from "react";
import bubbleMapData from "../data/bubble-map.json";
import eligibilityMapData from "../data/eligibility-map.json";
import selectedBubblesData from "../data/selected-bubbles.json";

interface BubbleMapType {
  voice: number[];
  sms: number[];
  bioscope: number[];
  fourg: number[];
  longevity: number[];
  mca: number[];
  data: number[];
}

interface SelectedBubblesType {
  longevity: number;
  voice: number;
  data: number;
  fourg: number;
  bioscope: number;
  sms: number;
  mca: boolean;
}

interface EligibilityMapType {
  [key: string]: {
    data: number[];
    fourg: number[];
    bioscope: number[];
    voice: number[];
    sms: number[];
  };
}

export default function Flexiplan() {
  const [bubbleMap] = useState<BubbleMapType>(bubbleMapData as BubbleMapType);
  const [selected, setSelected] = useState<SelectedBubblesType>({
    ...selectedBubblesData,
    mca: selectedBubblesData.mca !== 0,
  } as SelectedBubblesType);
  const [eligibilityMap] = useState<EligibilityMapType>(eligibilityMapData as EligibilityMapType);

  const formatValue = (value: number | boolean, type: string) => {
    if (type === "mca") return value ? "On" : "Off";
    if (["data", "fourg", "bioscope"].includes(type)) {
      return value >= 1024 ? `${value / 1024} GB` : `${value} MB`;
    }
    if (type === "voice") return `${value} Min`;
    if (type === "sms") return `${value} SMS`;
    if (type === "longevity") return `${value} ${value === 1 ? "Day" : "Days"}`;
    return value;
  };

  const getEligibleOptions = (type: string) => {
    const validityKey = `day_${selected.longevity}`;
    return (
      eligibilityMap[validityKey]?.[type as keyof typeof eligibilityMap[typeof validityKey]] || []
    );
  };

  const updateSelectionsOnLongevityChange = (newLongevity: number) => {
    const validityKey = `day_${newLongevity}`;
    const newEligibilityMap = eligibilityMap[validityKey] || {};

    setSelected((prev) => {
      const updatedSelections = { ...prev, longevity: newLongevity };

      for (const type in updatedSelections) {
        if (type !== "longevity" && type !== "mca" && newEligibilityMap[type as keyof typeof newEligibilityMap]) {
          const eligibleOptions = newEligibilityMap[type as keyof typeof newEligibilityMap];
          if (!eligibleOptions.includes(updatedSelections[type as keyof SelectedBubblesType] as number)) {
            updatedSelections[type as keyof SelectedBubblesType] = eligibleOptions[0] || 0;
          }
        }
      }

      return updatedSelections;
    });
  };

  const handleSelect = (type: keyof SelectedBubblesType, value: number | boolean) => {
    if (type === "longevity") {
      updateSelectionsOnLongevityChange(value as number);
    } else {
      setSelected((prev) => ({ ...prev, [type]: value }));
    }
  };

  const renderBubbles = (type: keyof SelectedBubblesType, title: string, subtitle?: string) => {
    if (type === "mca") {
      return (
        <div className="flex items-center justify-between py-4 border-b">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selected.mca}
              onChange={() => handleSelect("mca", !selected.mca)}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-green-600 peer-checked:after:translate-x-6 peer-checked:after:bg-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-gray-400 after:border-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
            <span className="ml-3 text-sm font-medium text-black">
              {selected.mca ? "On" : "Off"}
            </span>
          </label>
        </div>
      );
    }

    const values = type === "longevity" ? bubbleMap[type] : getEligibleOptions(type);

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          <div className="text-xl font-bold text-green-600 mt-1">
            {formatValue(selected[type], type)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <button
              key={value}
              onClick={() => handleSelect(type, value)}
              className={`h-12 w-12 rounded-full flex items-center justify-center text-sm transition-colors ${
                selected[type] === value
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-black hover:border-green-600 border border-gray-300"
              }`}
            >
              {value >= 1024 ? `${value / 1024}` : value}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="min-h-screen flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 w-full max-w-6xl mx-auto p-4">
          {/* Left Section */}
          <div className="bg-white shadow-md rounded-md p-4">
            <div className="border-b pb-4 mb-4">
              <h1 className="text-2xl font-bold text-black">Flexiplan</h1>
              <p className="text-sm text-gray-500">
                Make your own plan and enjoy great savings! Only for GP Customers
              </p>
            </div>
            <div className="grid gap-8">
              {renderBubbles("longevity", "Validity")}
              {renderBubbles("data", "Internet", "Regular")}
              {renderBubbles("fourg", "4G Internet", "4G enabled handset + SIM required")}
              {renderBubbles("voice", "Minutes", "Any Local Number")}
              {renderBubbles("bioscope", "Bioscope", "Only used to watch Bioscope")}
              {renderBubbles("sms", "SMS")}
              {renderBubbles("mca", "Missed Call Alert")}
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-white shadow-md rounded-md p-4">
            <h3 className="font-semibold text-lg mb-4 text-black">Your Selection:</h3>
            <ul className="space-y-4">
              {Object.keys(selected).map((key) => (
                <li key={key} className="flex justify-between text-black border-b pb-2">
                  <span className="capitalize">
                    {key === "mca"
                      ? "Missed Call Alert"
                      : key === "fourg"
                      ? "4G Internet"
                      : key}:
                  </span>
                  <span className="text-green-600">
                    {formatValue(selected[key as keyof SelectedBubblesType], key)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
