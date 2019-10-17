// const hostSite = "http://localhost:5000";
const prot = window.location.protocol;
const hostName = window.location.hostname;
const port = window.location.port;
const hostSite = `${prot}\/\/${hostName}\:${port}`;
