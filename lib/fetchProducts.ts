const fetchProducts = async (page = 1, limit = 10, search = "") => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search.trim()) {
    params.append("search", search);
  }
  const apiUrl = process.env.VERCEL_URL
    ? `https://agora-vert.vercel.app/api/products?${params.toString()}`
    : `http://localhost:3000/api/products?${params.toString()}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    products: data.products,
    total: data.total,
  };
};
export default fetchProducts;
