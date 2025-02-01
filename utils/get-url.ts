function GetApiUrl() {
  if (process.env.NODE_ENV === "production") {
    return process.env.API_URL;
  }
  return "http://localhost:8080";
}
