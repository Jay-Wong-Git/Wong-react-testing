describe("main", () => {
  it("should fetch a list of categories", async () => {
    const res = await fetch("/categories");
    const data = await res.json();

    console.log(data);
    expect(data).toHaveLength(3);
  });
});
