import fs from "node:fs/promises";

const getMDFiles = async (path: string) => {

  try {
    const mdFiles = await fs.readdir(path);
    return mdFiles.filter((file) => file.endsWith(".md"));
  } catch (error) {
    console.error("Error: ", error)
    return [];
  }

};

const readMDFile = async (pathToFile: string) => {
  let contents
  try {
    contents = await fs.readFile(pathToFile)
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error("Path Invalid", { cause: err })
    }
  }
  return contents
}

type confTestURL = "http://fakeurlthatdoesntexistontheweb.unknown"

type confAPIUrls = confTestURL

const makeConfReq = async (url: confAPIUrls, contents: string) => {
  const req = new Request(url, { method: "POST" })
  return req
}


export default getMDFiles;
export { readMDFile, makeConfReq }
