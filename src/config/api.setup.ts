const parts = window.location.href.split(":");
let url: string;

if (parts[1] === "//localhost") {
  url = `${parts[0]}:${parts[1]}:8080`;
} else {
  url = process.env.REACT_APP_API_URL || "";
}

export default url;
