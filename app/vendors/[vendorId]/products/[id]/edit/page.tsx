import { Metadata } from "next";
import { getProductById } from "@/lib/actions/product.actions";
import ProductForm from "@/components/vendor/product-form";

export const metadata: Metadata = {
    title: "Update product"
}
const AdminProductUpdatePage = async (props: {
    params: Promise<{
        vendorId: string,
        id: string
    }>
}) => {
    const {vendorId, id} = await props.params

    const product = await getProductById(id)
    if(!product) return notFound()
    return ( <div className='space-y-8 max-w-5xl mx-auto'>
        <h1 className="h2-bold">Update Product</h1>

        <ProductForm type='Update' product={product} productId={product.id} vendorId={vendorId} 
 />
    </div>  );
}
 
export default AdminProductUpdatePage;