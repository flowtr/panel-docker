export interface KeyValDef {
    [key: string]: {
        contentType: string;
        contentBytes: string;
    };
}

export interface ContainerData {
    id: string;
    name: string;
    image: string;
    state: string;
    status: string;
    env: KeyValDef;
    ports: KeyValDef;
    volumes: KeyValDef;
}
