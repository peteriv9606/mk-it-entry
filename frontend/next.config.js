const APIURL = process.env.APIURL || "http://localhost:4000"

module.exports = {
  reactStrictMode: true,
  env: {
    apiUrl: `${APIURL}/api/`,
  }
}