export default function ProductCard({ product }: { product: any }) {
    return (
        <div>
            <div className="bg-gray-100 shadow-md">
                {product.images && product.images.length > 0 ? (
                    <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-[346px] object-contain mb-2 rounded"
                    />
                ) : (
                    <div className="w-full h-48 bg-gray-300 mb-2 rounded flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                    </div>
                )}
            </div>
            <h3 className="text-lg">{product.title}</h3>
            <p className="font-semibold mb-1">${product.price}</p>
        </div>
    );
}