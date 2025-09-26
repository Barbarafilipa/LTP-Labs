import { Form, Link, useLoaderData, useLocation, useNavigate, useSubmit } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";

import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";

const PAGE_SIZE = 9;

// Faz fetch de todos os produtos e categorias da API necessários para mostrar
export async function loader({ request } : LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Separar parâmetros do URL
  const categories = url.searchParams.getAll("category");
  let rawSort = url.searchParams.get("sortBy") || "title";
  let sortBy = rawSort;
  let order = "asc";
  if (sortBy.includes("_")) {
    [sortBy, order] = sortBy.split("_");
  }
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const skip = (page - 1) * PAGE_SIZE;

  let products: any[] = [];
  let total = 0;

  // Dar fetch dos produtos
  if (categories.length === 0) {
    // Não há nenhuma categoria selecionada
    const res = await fetch(`https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}&sortBy=${sortBy}&order=${order}`);
    const data = await res.json();
    products = data.products;
    total = data.total;

  } else if (categories.length === 1) {
    // Há uma categoria selecionada
    const res = await fetch(`https://dummyjson.com/products/category/${categories[0]}?limit=${PAGE_SIZE}&skip=${skip}&sortBy=${sortBy}&order=${order}`);
    const data = await res.json();
    products = data.products;
    total = data.total;

  } else {
    // Há várias categorias selecionadas
    const fetches = categories.map(category => 
      fetch(`https://dummyjson.com/products/category/${category}`)
        .then(res => res.json())
    );

    const results = await Promise.all(fetches);
    const allProducts = results.flatMap(result => result.products);
   
    // Aplicar ordenação manualmente
    products = allProducts.sort((a, b) => {
      if (sortBy === "title") {
        return order === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "price") {
        return order === "asc" ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });

    total = allProducts.length;

    // Aplicar paginação manualmente
    products = products.slice(skip, skip + PAGE_SIZE);
  }

  // Dar fetch das categorias
  const categoriesRes = await fetch("https://dummyjson.com/products/category-list");
  const allCategories = await categoriesRes.json();

  return { products, categories: allCategories, selectedCategories: categories, rawSort, total, page, pageSize: PAGE_SIZE };
}

export default function Homepage() {
  const { products, categories, selectedCategories, total, page, pageSize, rawSort } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <div className="bg-white p-4 flex flex-row">
      <div className="flex flex-col flex-5">
        {/* Botão de sort e paginação */}
        <div className="flex justify-between items-center mb-4">
          <Form id="sortForm" method="get">
            {/*Manter as categorias selecionadas ao fazer sort*/}
            {selectedCategories.map((cat) => (
              <input key={cat} type="hidden" name="category" value={cat} />
            ))}

            <label htmlFor="sortBy" className="mr-2">Sort by:</label>
            <select
              id="sortBy"
              name="sortBy"
              defaultValue="title"
              onChange={(e) => submit(e.currentTarget.form, { replace: true })}
              className="mr-4 p-1 rounded border border-gray-300"
            >
              <option value="title">Title (A-Z)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </Form>
            
          <div className="text-[15px] items-center">
            Showing {Math.min((page - 1) * pageSize + 1, total)}-{Math.min(page * pageSize, total)} of {total} products
          </div>
        </div>

        {/* Grid com os produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>

        {/* Botões para a paginação */}
        <div className="flex justify-end mt-4">
          <Pagination page={page} total={total} pageSize={pageSize} />
        </div>
      </div>

      {/* Lista com as categorias */}
      <div className="flex-1 ml-8 ">
        <h3 className="text-xl mb-4">Categories</h3>
          <Form method="get" className="space-y-2">
            {/* Manter o sort selecionado ao filtrar por categoria */}
            <input type="hidden" name="sortBy" value={rawSort} />

            {categories.map((category: string) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="category"
                    value={category}
                    defaultChecked={selectedCategories.includes(category)}
                    onChange={(e) => submit(e.currentTarget.form, { replace: true })}
                    className="h-4 w-4 border-gray-300 rounded accent-midnight/80"
                  />
                  <span className="capitalize text-[15px]">{category}</span>
                </label>
            ))}
          </Form>
        <div className="border-t border-gray-400 mt-4"></div>
      </div>
    </div>
  );
}
