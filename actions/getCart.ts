import axios from "axios";

async function Get(params: string) {
  try {
    const apiUrl = process.env.API_URL!;
    const response = await axios.get(`${apiUrl}/${params}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user baskets:", error);
  }
}

export { Get };
