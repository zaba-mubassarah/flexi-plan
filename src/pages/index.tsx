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
    mca: Boolean(selectedBubblesData.mca), // Ensure boolean type
  } as SelectedBubblesType);
  const [eligibilityMap] = useState<EligibilityMapType>(eligibilityMapData as EligibilityMapType);

  const formatValue = (value: number | boolean, type: string): string => {
    if (type === "mca") return value ? "On" : "Off";
    if (["data", "fourg", "bioscope"].includes(type)) {
      return typeof value === "number"
        ? value >= 1024
          ? `${(value / 1024).toFixed(1)} GB`
          : `${value} MB`
        : "";
    }
    if (type === "voice") return `${value} Min`;
    if (type === "sms") return `${value} SMS`;
    if (type === "longevity") return `${value} ${value === 1 ? "Day" : "Days"}`;
    return String(value);
  };

  const getEligibleOptions = (type: keyof BubbleMapType): number[] => {
    const validityKey = `day_${selected.longevity}`;
    const eligibilityForKey = eligibilityMap[validityKey];

    if (eligibilityForKey && type in eligibilityForKey) {
      return eligibilityForKey[type as keyof typeof eligibilityForKey] || [];
    }

    return [];
  };

  const updateSelectionsOnLongevityChange = (newLongevity: number) => {
    const validityKey = `day_${newLongevity}`;
    const newEligibilityMap = eligibilityMap[validityKey] || {};

    setSelected((prev) => {
      const updatedSelections = { ...prev, longevity: newLongevity };

      (Object.keys(updatedSelections) as Array<keyof SelectedBubblesType>).forEach((type) => {
        if (
          type !== "longevity" &&
          type !== "mca" &&
          newEligibilityMap[type as keyof typeof newEligibilityMap]
        ) {
          const eligibleOptions = newEligibilityMap[type as keyof typeof newEligibilityMap] || [];
          if (!eligibleOptions.includes(updatedSelections[type] as number)) {
            updatedSelections[type] = eligibleOptions[0] || 0;
          }
        }
      });

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
        <div className="py-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg text-gray-900">{title}</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selected.mca}
                onChange={() => handleSelect("mca", !selected.mca)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-green-600 peer-checked:after:translate-x-6 peer-checked:after:bg-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-gray-400 after:border-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
              <span className="ml-3 text-sm text-gray-900">
                {selected.mca ? "On" : "Off"}
              </span>
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500">Validity: 30 days</p>
        </div>
      );
    }

    const values =
      type === "longevity" ? bubbleMap[type] : getEligibleOptions(type as keyof BubbleMapType);

    return (
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-2 border-b">
        <div className="w-36 md:w-40">
          <h3 className="text-lg text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          <div className="text-lg text-green-600 mt-1">
            {formatValue(selected[type], type)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <button
              key={value}
              onClick={() => handleSelect(type, value)}
              className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-colors ${
                selected[type] === value
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-900 hover:border-green-600 border border-gray-300"
              }`}
            >
              {value >= 1024 ? `${(value / 1024).toFixed(1)}` : value}
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
          <div className="bg-white rounded-md p-4">
            <div className="border-b pb-4 mb-4">
              <h1 className="text-xl text-gray-900">Flexiplan</h1>
              <p className="text-sm text-gray-500">
                Make your own plan and enjoy great savings! Only for GP Customers
              </p>
            </div>
            <div className="grid gap-4">
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
          <div className="bg-white rounded-md p-4">
            <h3 className="text-lg mb-4 text-gray-900">Your Selection:</h3>
            <ul className="space-y-4">
              {Object.keys(selected).map((key) => (
                <li key={key} className="flex justify-between text-gray-900 border-b pb-2">
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
