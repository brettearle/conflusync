import { describe, it } from "node:test";
import getListOfMDFiles, { createPayload } from "./fileManipulation.js";
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

describe("createPayload", async () => {
  it("should take a path to file and return a payload fitting confluence api", async () => {
    setUp()
    const got = createPayload("./testFiles/file1.md")
    const want = {
      spaceId: "",
      status: "current",
      title: "",
      parentId: "",
      body: {
        representation: "storage",
        value: ""
      }
    }
    assert.deepStrictEqual(got, want)
  });
})

