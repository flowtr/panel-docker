import Docker from "dockerode";

const isWindows = process.platform === "win32";

let options = {};

if (isWindows)
    options = {
        host: "127.0.0.1",
        port: 2375,
    };
else
    options = {
        socketPath: "/var/run/docker.sock",
    };

export default new Docker(options);
