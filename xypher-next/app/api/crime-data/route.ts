import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const crimeType = searchParams.get("type") || "crimes_against_women";

        // Map crime type to file name
        const fileMap: { [key: string]: string } = {
            crimes_against_women: "crimes_against_women_2022.metrics.json",
            cyber_crime: "cyber_crime_2022.metrics.json",
            economic_crime: "economic_crime_2022.metrics.json",
            murder_homicide: "murder_homicide_2022.metrics.json",
        };

        const fileName = fileMap[crimeType];
        if (!fileName) {
            return NextResponse.json(
                { error: "Invalid crime type" },
                { status: 400 }
            );
        }

        // Construct the file path
        const filePath = path.join(
            process.cwd(),
            "..",
            "RAW_DATA_JOSN_FORMAT",
            fileName
        );

        // Read the file
        const fileContents = fs.readFileSync(filePath, "utf8");
        const data = JSON.parse(fileContents);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error reading crime data:", error);
        return NextResponse.json(
            { error: "Failed to load crime data" },
            { status: 500 }
        );
    }
}
