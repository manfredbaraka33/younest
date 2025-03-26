
export const getProductsOrServices = async () => {
  const response = await fetch("https://younest.onrender.com/api/fetch_all_pos/");
  const data = await response.json();
  console.log(data.products);
  return data.products;
};

export const getShops = async () => {
  const response = await fetch("https://younest.onrender.com/api/shops/");
  const data = await response.json();
  console.log(data.results);
  return data.results;
};


export const getFosSale = async () => {
  const response = await fetch("https://younest.onrender.com/api/forsale2/");
  const data = await response.json();
  console.log(data.products);
  return data.products;
};






