import { Container, ContainerInfo } from "dockerode";
import { Socket } from "socket.io";
import { ContainerData } from "./common/types";

const { sendNotFound, assets } = require("./util");
const { App } = require("@tinyhttp/app");
const path = require("path");
const { cors } = require("@tinyhttp/cors");
const { logger } = require("@tinyhttp/logger");
import docker from "./dockerapi";

// Init servers
const app = new App({
    noMatchHandler: sendNotFound,
});

// Use the environment port if available, or default to 3000
const port = parseInt(process.env.PORT || "3000");
app.get("/", sendNotFound);

// Serve static files from /public
app.use([logger(), cors({})]);
app.use(assets);

// Start the server
const server = app.listen(port, () =>
    console.log(`Server started on port ${port}`)
);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
    },
});

function refreshContainers() {
    docker.listContainers(
        { all: true },
        (err: unknown, containers: ContainerInfo[]) => {
            if (err) io.emit("error.refresh");
            io.emit("containers.list", containers);
        }
    );
}

setInterval(refreshContainers, 2000);

io.on("connection", (socket: Socket) => {
    socket.on("containers.list", () => {
        refreshContainers();
    });

    socket.on("container.start", (args) => {
        const container = docker.getContainer(args.id);

        if (container) container.start({}, () => refreshContainers());
    });

    socket.on("container.stop", (args) => {
        const container = docker.getContainer(args.id);

        if (container) container.stop({}, () => refreshContainers());
    });

    socket.on("container.rm", (args) => {
        const container = docker.getContainer(args.id);

        if (container)
            container.stop({}, () =>
                container.remove(() => refreshContainers())
            );
    });

    socket.on("image.run", (args: ContainerData) => {
        console.log(`Received: ${JSON.stringify(args)}`);
        /*         const argPort = args.ports ? Object.entries(args.ports).map(
            (e) =>
                ({[`${e[0]}/tcp`]: [{HostPort: Buffer.from(
                  e[1].contentBytes
              ).toString("ascii")}]})) */
        const argPort: Record<string, { HostPort: string }[]> = {};
        const exposedPorts: Record<string, Record<string, unknown>> = {};
        const volumes: Record<string, Record<string, unknown>> = {};

        if (args.volumes && args.volumes !== {})
            Object.entries(args.volumes).forEach((e) => {
                volumes[e[0]] = {};
            });

        if (args.ports && args.ports !== {}) {
            Object.entries(args.ports).forEach((e) => {
                argPort[`${e[0]}/tcp`] = [
                    {
                        HostPort: Buffer.from(e[1].contentBytes).toString(
                            "ascii"
                        ),
                    },
                ];
            });
            Object.entries(args.ports).forEach((e) => {
                exposedPorts[`${e[0]}/tcp`] = {};
            });
        }

        docker
            .pull(args.image)
            .then(() => {
                docker.createContainer(
                    {
                        name: args.name,
                        Image: args.image,
                        Env: args.env
                            ? Object.entries(args.env).map(
                                  (e) =>
                                      `${e[0]}=${Buffer.from(
                                          e[1].contentBytes
                                      ).toString("ascii")}`
                              )
                            : [],
                        ExposedPorts: exposedPorts,
                        Volumes: volumes,
                        HostConfig: {
                            Binds:
                                args.volumes !== {}
                                    ? Object.entries(args.volumes).map(
                                          (e) => `${e[0]}:${e[1]}`
                                      )
                                    : [],
                            PortBindings: argPort,
                        },
                    },
                    (err: unknown, container: Container) => {
                        if (!err)
                            container.start((err) => {
                                if (err)
                                    socket.emit("error.image", {
                                        message: err,
                                    });
                            });
                        else socket.emit("error.image", { message: err });
                    }
                );
            })
            .catch((err: unknown) =>
                socket.emit("error.image", { message: err })
            );
    });
});
