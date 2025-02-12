import fs from "fs/promises";
import path from "path";
import type { InstanceInfo, InstanceOptions } from "../../types";
import { instancesPath } from "../constants";
import { pathExists } from "../pathExists";

export async function getInstances(): Promise<InstanceInfo[]> {
    if (!(await pathExists(instancesPath))) await fs.mkdir(instancesPath);

    const instances = await fs.readdir(instancesPath);

    return Promise.all(
        instances.map(async (instance) => {
            const conf = await fs.readFile(
                path.join(instancesPath, instance, "multiserver.config.json"),
                "utf8"
            );

            return {
                path: path.join(instancesPath, instance),
                info: JSON.parse(conf) as InstanceOptions,
            };
        })
    );
}
