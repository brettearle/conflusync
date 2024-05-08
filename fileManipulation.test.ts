import { describe, it } from "node:test";
import getListOfMDFiles, { ConfAPIUrls, ConfPage, makeConfReq, newConfPage, readMDFile } from "./fileManipulation.js";
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



describe("conf page builders", async () => {
  it("newConfPageMeta should return the meta fields as an object", () => {
    const got = newConfPageMeta("spaceID", "draft", "title", "parent")
    const want = {
      spaceId: "spaceID",
      status: "draft",
      title: "title",
      parentId: "parent",
    }
    assert.deepEqual(got, want)
  })

  it("newConfPage should return a confluence page object", () => {
    const got = newConfPage({
      spaceId: "spaceID",
      status: "draft",
      title: "title",
      parentId: "parent",
    }, {
      body: {
        representation: "storage",
        value: "body content goes here"
      }
    })
    const want = {
      spaceId: "spaceID",
      status: "draft",
      title: "title",
      parentId: "parent",
      body: {
        representation: "storage",
        value: "body content goes here"
      }
    }
    assert.deepEqual(got, want)
  })
})

describe("makeConfRequest", async () => {
  const testContents: ConfPage = {
    spaceId: "string",
    status: "draft",
    title: "string",
    parentId: "string",
    body: {
      representation: "storage",
      value: "body content goes here"
    }
  }

  const nonExistentUrl: ConfAPIUrls = "http://fakeurlthatdoesntexistontheweb.unknown"

  it("should be a Request", async () => {
    const got = await makeConfReq(nonExistentUrl, testContents)
    assert(got instanceof Request)
  })

  it("should have the url passed in", async () => {
    const builtReq = await makeConfReq(nonExistentUrl, testContents)
    const got = builtReq.url.toString().slice(0, -1)
    assert.strictEqual(got, nonExistentUrl.toString())
  })

  it("should be a POST", async () => {
    const got = await makeConfReq(nonExistentUrl, testContents)
    assert.strictEqual(got.method, "POST")
  })

  it("should have a body of contents passed in", async () => {
    const builtReq = await makeConfReq(nonExistentUrl, testContents)
    const reqBody = await builtReq.json()
    const got = reqBody.body.value
    const want = "body content goes here"
    assert.strictEqual(got, want)
  })
})


