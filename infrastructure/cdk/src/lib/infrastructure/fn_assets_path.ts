import { resolve } from "path";

let assetsPath: string;

export function setAssetsPath(path: string) {
    assetsPath = path;
}

export function getFnFullPath(fnName: string) {
    return resolve(assetsPath, fnName);
}