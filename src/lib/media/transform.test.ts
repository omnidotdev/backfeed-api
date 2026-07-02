import { describe, expect, test } from "bun:test";

import sharp from "sharp";

import {
  ALLOWED_WIDTHS,
  applyTransform,
  generateLqip,
  guessImageType,
  parseTransform,
  snapWidth,
} from "./transform";

/** A small solid-colour PNG to feed the sharp-backed helpers */
const makePng = (width: number, height: number): Promise<Buffer> =>
  sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 120, g: 80, b: 200 },
    },
  })
    .png()
    .toBuffer();

describe("snapWidth", () => {
  test("snaps up to the nearest allowed width", () => {
    expect(snapWidth(1)).toBe(320);
    expect(snapWidth(321)).toBe(640);
    expect(snapWidth(960)).toBe(960);
  });

  test("caps at the largest allowed width", () => {
    expect(snapWidth(5000)).toBe(ALLOWED_WIDTHS[ALLOWED_WIDTHS.length - 1]);
  });
});

describe("guessImageType", () => {
  test("maps known image extensions", () => {
    expect(guessImageType("a/b/c.png")).toBe("image/png");
    expect(guessImageType("x.JPG")).toBe("image/jpeg");
    expect(guessImageType("x.jpeg")).toBe("image/jpeg");
    expect(guessImageType("x.webp")).toBe("image/webp");
    expect(guessImageType("x.avif")).toBe("image/avif");
  });

  test("returns undefined for non-image or extensionless keys", () => {
    expect(guessImageType("clip.mp4")).toBeUndefined();
    expect(guessImageType("noext")).toBeUndefined();
  });
});

describe("parseTransform", () => {
  test("returns null when no transform params are present", () => {
    expect(parseTransform({})).toBeNull();
    expect(parseTransform({ q: "50" })).toBeNull();
  });

  test("parses width and snaps it, defaulting quality", () => {
    expect(parseTransform({ w: "500" })).toEqual({
      width: 640,
      quality: 80,
      format: undefined,
    });
  });

  test("honours a valid explicit quality and format", () => {
    expect(parseTransform({ w: "300", q: "60", fm: "webp" })).toEqual({
      width: 320,
      quality: 60,
      format: "webp",
    });
  });

  test("ignores an out-of-range quality and an unknown format", () => {
    expect(parseTransform({ w: "300", q: "999", fm: "gif" })).toEqual({
      width: 320,
      quality: 80,
      format: undefined,
    });
  });

  test("allows a format-only request (no resize)", () => {
    expect(parseTransform({ fm: "jpeg" })).toEqual({
      width: undefined,
      quality: 80,
      format: "jpeg",
    });
  });
});

describe("applyTransform", () => {
  test("resizes down to the requested width and never enlarges", async () => {
    const input = await makePng(1000, 500);

    const resized = await applyTransform(input, { width: 320, quality: 80 });
    expect(resized.contentType).toBe("image/webp");
    expect((await sharp(resized.bytes).metadata()).width).toBe(320);

    // withoutEnlargement: a 320px source is not blown up to 640
    const notEnlarged = await applyTransform(await makePng(320, 160), {
      width: 640,
      quality: 80,
    });
    expect((await sharp(notEnlarged.bytes).metadata()).width).toBe(320);
  });

  test("emits the requested output format", async () => {
    const input = await makePng(100, 100);
    const jpeg = await applyTransform(input, { quality: 80, format: "jpeg" });
    expect(jpeg.contentType).toBe("image/jpeg");
    expect((await sharp(jpeg.bytes).metadata()).format).toBe("jpeg");
  });
});

describe("generateLqip", () => {
  test("produces a tiny inline webp data URL", async () => {
    const lqip = await generateLqip(await makePng(1200, 800));
    expect(lqip.startsWith("data:image/webp;base64,")).toBe(true);

    const bytes = Buffer.from(lqip.split(",")[1], "base64");
    const meta = await sharp(bytes).metadata();
    expect(meta.format).toBe("webp");
    expect(meta.width).toBe(16);
  });
});
