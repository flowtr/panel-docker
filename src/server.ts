const { sendNotFound, assets } = require("./util");
const { App } = require("@tinyhttp/app");
const path = require("path");
const { cors } = require("@tinyhttp/cors");
const { logger } = require("@tinyhttp/logger");

// Init servers
let app = new App({
    noMatchHandler: sendNotFound,
});
const docker = require("./dockerapi.ts");

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
const io = require("socket.io")(server);

function refreshContainers() {
    docker.listContainers({ all: true }, (err, containers) => {
        io.emit("containers.list", containers);
    });
}

setInterval(refreshContainers, 2000);

io.on("connection", (socket) => {
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

    socket.on("image.run", (args) => {
        console.log(`Received: ${JSON.stringify(args)}`);
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
                            : {},
                        ExposedPorts: args.ports ? args.ports : {},
                        Volumes: Object.fromEntries(
                            Object.entries(args.volumes).map((e) => e[0])
                        ),
                        HostConfig: {
                            Binds: Object.entries(args.volumes).map(
                                (e) => `${e[0]}:${e[1]}`
                            ),
                        },
                    },
                    (err, container) => {
                        if (!err)
                            container.start((err) => {
                                if (err)
                                    socket.emit("image.error", {
                                        message: err,
                                    });
                            });
                        else socket.emit("image.error", { message: err });
                    }
                );
            })
            .catch((err) => socket.emit("image.error", { message: err }));
    });
});
