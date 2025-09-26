import { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import ImageGallery from "../components/ImageGallery";
import { redirect } from "@remix-run/react";

import { cartCookie } from "../cookies";
import type { CartItem } from "../types/cart";

export async function loader({
    params,
}: LoaderFunctionArgs) {
    const product = await fetch(`https://dummyjson.com/products/${params.id}`);
    const data = await product.json();
    return data;
}

export async function action({ request }: ActionFunctionArgs) {
  // Vai buscar os dados do produto a adicionar ao carrinho
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));
  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));
  const quantity = Number(formData.get("quantity")) || 1;
  const image = formData.get("image") as string | undefined;

  // Adiciona o produto ao carrinho
  const cart = (await cartCookie.parse(request.headers.get("Cookie"))) || [];
  
  // Se o produto já existe no carrinho, incrementa a quantidade
  const existingProduct = cart.find((item : CartItem) => item.productId === productId);
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({ productId, title, price, quantity, image });
  }

  console.log("Carrinho atualizado:", JSON.stringify(cart, null, 2));

  // Redireciona de volta à mesma página com o cookie atualizado
  return redirect(request.headers.get("Referer") || "/", {
    headers: {
      "Set-Cookie": await cartCookie.serialize(cart),
    },
  });
}

export default function ProductDetails() {
    const product = useLoaderData<typeof loader>();

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-4">
            {/* Galeria de imagens */}
            <div className="flex-[2]">
                <ImageGallery product={product} />
            </div>


            {/* Informações */}
            <div className="flex-1 flex flex-col gap-4">
                <div >
                    <h2 className="text-[28px] font-bold">{product.title}</h2>
                    <h2 className="text-[28px] font-semibold">${product.price}</h2>
                </div>

                <Form method="post">
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="title" value={product.title} />
                    <input type="hidden" name="price" value={product.price} />
                    <input type="hidden" name="quantity" value={1} />
                    <input type="hidden" name="image" value={product.images[0]} />
                    <button 
                        type="submit"
                        className="bg-midnight w-full text-white px-4 py-2 rounded hover:bg-midnight/60 w-fit"
                    >
                        Add to Cart
                    </button>
                </Form>

                <hr className="mt-2 border-t border-gray-300" />

                <h3 className="text-lg font-semibold">Product Details</h3>
                <p>{product.description}</p>
            </div>
        </div>
    );
}