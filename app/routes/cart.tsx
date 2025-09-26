import { Form, redirect, useLoaderData } from "@remix-run/react";
import { Cart, CartItem } from "../types/cart";
import { cartCookie } from "../cookies";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Trash2 } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  const cart: Cart = (await cartCookie.parse(cookie)) || [];
  return { cart };
}

export async function action({ request }: ActionFunctionArgs) {
    // Vai buscar os dados do produto a adicionar ao carrinho
    const formData = await request.formData();
    const productId = Number(formData.get("productId"));
    const actionType = formData.get("actionType");

    let cart = (await cartCookie.parse(request.headers.get("Cookie"))) || [];
    
    // Incrementa ou decrementa a quantidade do produto, ou elimina-o
    const existingProduct = cart.find((item : CartItem) => item.productId === productId);
    if (existingProduct && actionType === "increment") {
        existingProduct.quantity += 1;
    } else if (existingProduct && actionType === "decrement") {
        existingProduct.quantity = Math.max(1, existingProduct.quantity - 1);
    } else if (existingProduct && actionType === "remove") {
        cart = cart.filter((p: CartItem) => p.productId !== productId);
    }

    console.log("Carrinho atualizado:", JSON.stringify(cart, null, 2));

    // Redireciona de volta à mesma página com o cookie atualizado
    return redirect("/cart", {
        headers: {
            "Set-Cookie": await cartCookie.serialize(cart),
        },
    });
}

export default function ShoppingCart() {
    const { cart } = useLoaderData<{ cart: Cart }>();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = cart.length > 0 ? 20 : 0;
    const total = subtotal + shipping;

    return (
        <div className="flex p-4 gap-8">
            <div className="flex flex-col gap-4 flex-5">
                {cart.length === 0 && (
                    <p>Your cart is empty.</p>
                )}
                {cart.map(item => (
                    <div key={item.productId} className="flex items-center justify-between border-b border-gray-300 pb-4">
                        <div className="flex gap-4">
                            <img src={item.image} alt={item.title} className="w-[156px] h-[156px] object-contain bg-gray-100" />
                            <div className="flex flex-col justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                                    <div className="font-medium">${item.price * item.quantity}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 mt-2 p-1 border border-gray-400 rounded-[8px]">
                                        {/* Botão diminuir */}
                                        <Form method="post">
                                            <input type="hidden" name="productId" value={item.productId} />
                                            <input type="hidden" name="actionType" value="decrement" />
                                            <button
                                            type="submit"
                                            className="px-3 py-1 rounded hover:bg-gray-100 text-xl font-bold"
                                            >
                                            −
                                            </button>
                                        </Form>

                                        <p className="text-md font-normal">{item.quantity}</p>

                                        {/* Botão aumentar */}
                                        <Form method="post">
                                            <input type="hidden" name="productId" value={item.productId} />
                                            <input type="hidden" name="actionType" value="increment" />
                                            <button
                                            type="submit"
                                            className="px-3 py-1 rounded hover:bg-gray-100 text-xl font-bold"
                                            >
                                            +
                                            </button>
                                        </Form>
                                    </div>

                                    {/* Botão de eliminar */}
                                    <Form method="post">
                                        <input type="hidden" name="productId" value={item.productId} />
                                        <input type="hidden" name="actionType" value="remove" />
                                        <button
                                            type="submit"
                                            className="px-2 py-2 mt-2 rounded hover:bg-gray-100"
                                        >
                                            <Trash2/>
                                        </button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-2 flex-col border border-gray-400 rounded-[8px] p-6 pt-4 self-start">
                <h2 className="text-lg font-bold mb-2">Cart Summary</h2>

                <div className="flex justify-between mb-2">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                </div>

                <div className="flex justify-between mb-2">
                    <p>Shipping</p>
                    <p>${shipping.toFixed(2)}</p>
                </div>

                <div className="flex justify-between">
                    <p>Total</p>
                    <p className="text-lg">${total.toFixed(2)}</p>
                </div>

                <button className="bg-midnight text-white rounded-[8px] py-2 my-4 w-full text-center">
                    Check out
                </button>

                <p className="w-full text-center mb-2">Or pay with PayPal</p>

                <hr className="my-4" />

                <div>
                    <p>Promo code</p>
                    <div className="flex gap-2 justify-between">
                        <input 
                            type="text"
                            defaultValue="Enter code"
                            className="flex-3 border border-gray-400 rounded-[8px] p-2 gap-3"
                        />

                        <button className="flex-1 bg-midnight text-white rounded-[8px] p-2 gap-3">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
  );
}
