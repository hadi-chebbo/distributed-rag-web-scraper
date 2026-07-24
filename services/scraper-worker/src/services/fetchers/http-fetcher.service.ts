import axios from "axios";

export async function fetchWithHttp(url: string) {
    const response = await axios.get<string>(url, {
        timeout: 15_000,
        responseType: "text",
        headers: {
            "User-Agent":
                "DistributedRagScraper/0.1 (educational project)",
        },
    });

    return {
        html: response.data,
        statusCode: response.status,
    };
}