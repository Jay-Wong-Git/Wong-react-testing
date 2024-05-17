import { http, HttpResponse } from "msw";

import { products, categories } from "./data";

export const handlers = [
  http.get("/categories", () => HttpResponse.json(categories)),

  http.get("/products", () => HttpResponse.json(products)),

  http.get("/products/:id", ({ params }) => {
    const id = parseInt(params.id as string);
    const product = products.find((p) => p.id === id);
    if (product) return HttpResponse.json(product);
    return new HttpResponse(null, { status: 404 });
  }),
];
