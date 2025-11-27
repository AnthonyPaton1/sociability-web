import ProductCard from "@/components/shared/header/product/product-card";
import { getAllProducts } from "@/lib/actions/product.actions";
import SearchFilters from "@/components/shared/header/SearchFilterClient";
import SortDropdown from "@/components/shared/header/sort-dropdown";

const SearchPage = async (props: {
    searchParams: Promise<{
        q?: string;
        category?: string;
        price?: string;
        rating?: string;
        sort?: string;
        page?: string;
    }>
}) => {
 const {
    q = 'all',
    category = 'all',
    rating = 'all',
    price = 'all',
    sort = 'newest',
    page= '1',
 } = await props.searchParams;

 const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    page: Number(page),
    sort,
 });

    return ( 
      <div className='grid md:grid-cols-5 md:gap-5'>
        <div className="p-4">
          <SearchFilters />
        </div>
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {products.data.length === 0 
                ? "No products found" 
                : `Showing ${products.data.length} products`}
            </p>
            <SortDropdown />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    );
}
 
export default SearchPage;