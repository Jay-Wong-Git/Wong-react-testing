import { db } from "./mocks/db";

describe("main", () => {
  it("should", () => {
    const product = db.product.create();
    console.log(product);
  });
});
