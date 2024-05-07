import { describe, it } from "node:test";
import getListOfMDFiles, { makeConfReq, readMDFile } from "./fileManipulation.js";
import assert from "node:assert";
import fs from "node:fs";

const setUp = () => {
  if (!fs.existsSync("./testFiles")) {
    fs.mkdirSync("./testFiles");
  }
  fs.writeFileSync("./testFiles/file1.md", "Hello World");
  fs.writeFileSync("./testFiles/file2.md", "Hello World");
};

const tearDown = () => {
  try {
    fs.unlinkSync("./testFiles/file1.md");
    fs.unlinkSync("./testFiles/file2.md");
    fs.rmdirSync("./testFiles");
  } catch (e: unknown) {
  }
};

describe("getListOfMDFiles with md files that exist", async () => {
  it("should return a list of markdown files when path has md files", async () => {
    setUp();
    const path = "./testFiles";
    const mdFiles = await getListOfMDFiles(path);
    assert.deepStrictEqual(mdFiles, ["file1.md", "file2.md"]);
    tearDown();
  });
});

describe("getListOfMDFiles with md files that do not exist", async () => {
  it("should return an empty list when path does not exist", async () => {
    tearDown()
    const path = "./testFiles";
    const mdFiles = await getListOfMDFiles(path);
    assert.deepStrictEqual(mdFiles, []);
  });
});

describe("readFile", () => {
  it("should return contents of single file", async () => {
    setUp()
    const got = await readMDFile("./testFiles/file1.md")
    const want = "Hello World"
    assert.equal(got, want)
    tearDown()
  });

  it("throws if path to file doesn't exist", async () => {
    await assert.rejects(() => readMDFile("nonExistentPath"))
  });

  it("throws on wrong path with msg: Path Invalid", async () => {
    await assert.rejects(() => readMDFile("nonExistentPath"), { message: "Path Invalid" })
  });
});

describe("makeConfRequest", async () => {
  it("should be a Request", async () => {
    const got = await makeConfReq()
    assert(got instanceof Request)
  })
})

