describe("main", () => {
  it("should fetch a list of categories", async () => {
    const res = await fetch("/categories");
    const categories = await res.json();

    console.log(categories);
    expect(categories).toHaveLength(3);
  });
});
