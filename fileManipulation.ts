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

type ConfTestURL = "http://fakeurlthatdoesntexistontheweb.unknown"
export type ConfAPIUrls = ConfTestURL

export type ConfPage = {
  spaceId: string,
  status: "current" | "draft",
  title: string,
  parentId: string,
  body: {
    representation: "storage" | "atlas_doc_format" | "wiki",
    value: string
  }
}

type ConfPageMeta = Omit<ConfPage, "body">
type ConfPageBody = Pick<ConfPage, "body">

const newConfPage = (meta: ConfPageMeta, body: ConfPageBody): ConfPage => {
  return { ...meta, ...body }
}

const makeConfReq = async (url: ConfAPIUrls, contents: ConfPage) => {
  const req = new Request(url, { method: "POST", body: JSON.stringify(contents) })
  return req
}


export default getMDFiles;
export { readMDFile, makeConfReq, newConfPage }
