
import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, QuoteData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    vehicle_year: { type: Type.NUMBER, description: "The model year of the vehicle." },
    vehicle_make: { type: Type.STRING, description: "The make of the vehicle (e.g., Ford)." },
    vehicle_model: { type: Type.STRING, description: "The model of the vehicle (e.g., F-150)." },
    gross_vehicle_value: { type: Type.NUMBER, description: "The base market value of the vehicle before any deductions." },
    total_deductions: { type: Type.NUMBER, description: "The sum of all deductions." },
    final_vehicle_value: { type: Type.NUMBER, description: "The final offer for the vehicle after all deductions." },
    deductions: {
      type: Type.ARRAY,
      description: "A list of reasons and amounts for value deductions.",
      items: {
        type: Type.OBJECT,
        properties: {
          reason: { type: Type.STRING, description: "A brief explanation for the deduction." },
          amount: { type: Type.NUMBER, description: "The monetary value of the deduction." },
        },
        required: ["reason", "amount"],
      },
    },
  },
  required: ["vehicle_year", "vehicle_make", "vehicle_model", "gross_vehicle_value", "total_deductions", "final_vehicle_value", "deductions"],
};

const buildPrompt = (data: FormData): string => {
  return `
    You are an expert vehicle valuation AI for a car liquidation company.
    Your task is to provide a fair market liquidation quote for a used vehicle based on the following details.
    The final value should reflect what a scrapyard or auction house would realistically pay.

    Vehicle Details:
    - VIN: ${data.vin}
    - Mileage: ${data.mileage.toLocaleString()} miles

    Vehicle Condition:
    - Powertrain: ${data.powertrainCondition}
    - Has Title: ${data.hasTitle}
    - Has Catalytic Converter: ${data.hasCatalytic}
    - Has Aluminum Wheels: ${data.hasAluminumWheels}
    - Has Battery: ${data.hasBattery}
    - Needs Towing: ${data.needsTowing}
    - Has Key: ${data.hasKey}
    
    Seller's Location (for market context):
    - City: ${data.sellerAddress.city}
    - State: ${data.sellerAddress.state}

    Instructions:
    1.  First, determine the vehicle's year, make, and model from the VIN.
    2.  Establish a "Gross Vehicle Value". This is a baseline value for a similar vehicle in good, running condition in the specified market area. Assume average market scrap and parts values.
    3.  Apply deductions based on the provided condition. Common deductions include:
        - High Mileage: Apply a deduction for high mileage.
        - Powertrain Condition: "Inoperable" or "Not Running" should have significant deductions. "Parts Only" implies value is only in scrap and individual components.
        - Missing Title: A very significant deduction, as it limits resale options.
        - Missing Catalytic Converter: A large deduction due to high replacement/scrap cost.
        - Missing Aluminum Wheels, Battery, Key: Apply smaller, reasonable deductions for each missing component.
        - Towing Required: Apply a standard deduction for towing costs (e.g., $150-$300).
    4.  Calculate the "Total Deductions" by summing up all individual deduction amounts.
    5.  Calculate the "Final Vehicle Value" by subtracting the Total Deductions from the Gross Vehicle Value. The final value can be zero but not negative.
    6.  Return the response in the specified JSON format. Ensure all monetary values are numbers without currency symbols.
  `;
};

export const getVehicleQuote = async (formData: FormData): Promise<QuoteData> => {
  const prompt = buildPrompt(formData);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("API returned an empty response.");
    }
    const quoteData: QuoteData = JSON.parse(jsonText);
    return quoteData;
  } catch (error) {
    console.error("Error fetching vehicle quote from Gemini API:", error);
    throw new Error("Failed to communicate with the valuation service. Please check your inputs or try again later.");
  }
};
