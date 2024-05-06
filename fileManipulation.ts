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

const createPayload = (path: string) => {
  console.log(path)
  return {}
}

export default getMDFiles;
export { createPayload };
