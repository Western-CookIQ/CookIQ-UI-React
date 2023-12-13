let parts = window.location.href.split(":");
let url = "";
if ((parts[1] = "//localhost")) url = parts[0] + ":" + parts[1] + ":8080";
else url = process.env.PUBLIC_URL;

export default url;
