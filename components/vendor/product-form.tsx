"use client";
import { productDefaultvalues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {  ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import slugify from "slugify";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../ui/form";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";


const ProductForm = ({
  type,
  product,
  productId,
  vendorId
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
  vendorId: string;
}) => {
   
  const router = useRouter();
  
type ProductFormValues = z.infer<typeof insertProductSchema> & {
  id?: string;
};

const form = useForm<ProductFormValues>({
  resolver: zodResolver(
    type === "Update" ? updateProductSchema : insertProductSchema
  ) as any, // ← Add type assertion here
  defaultValues:
    type === "Update"
      ? {
          ...(product as ProductFormValues),
          vendorId,
        }
      : { ...productDefaultvalues, vendorId },
});

 const onSubmit = async (values: ProductFormValues) => {
  if (type === 'Create') {
    const dataToSend = { ...values, vendorId };
    
    try {
      const res = await createProduct(dataToSend);
      
      if (!res.success) {
        toast.error(String(res.message)); 
      } else {
        toast.success(String(res.message)); 
        router.push(`/vendors/${vendorId}/products`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
    return;
  }
//onUpdate
if (type === 'Update') {
  if(!productId) {
    router.push(`/vendors/${vendorId}/products`)
    return
  }
  
  // Use product.vendorId instead of the vendorId prop
  const dataToSend = { ...values, id: productId, vendorId: product?.vendorId || vendorId };
  
  const res = await updateProduct(dataToSend);
  
  if (!res.success) {
    toast.error(res.message); 
  } else {
    toast.success(res.message); 
    router.push(`/vendors/${product?.vendorId || vendorId}/products`)
  }
}
  }

  const images = form.watch('images')
 

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <input type="hidden" {...form.register("vendorId")} value={vendorId} />
        <div className="flex flex-col md:flex-row gap-5">
          {/* Name */}
          <FormField 
          control ={form.control}
          name="name"
          render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'>}) => (
            <FormItem className='w-full'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Product Name" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          {/* Slug */}
          <FormField 
          control ={form.control}
          name="slug"
          render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'>}) => (
            <FormItem className='w-full'>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                <Input placeholder="Enter Slug" {...field}/>
                <Button type='button' className="bg-gray-500 hover-bg-gray-600 text-white px-4 py-1"
                onClick={() => {
                  form.setValue('slug', slugify(form.getValues('name'), {lower: true}))
                }}
                >Generate</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* category */}
          <FormField 
          control ={form.control}
          name="category"
          render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'category'>}) => (
            <FormItem className='w-full'>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Enter Category Field" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          {/* Brand */}
          <FormField 
          control ={form.control}
          name="brand"
          render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'brand'>}) => (
            <FormItem className='w-full'>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="Enter Brand" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Price */}
          <FormField 
          control ={form.control}
          name="price"
          render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'price'>}) => (
            <FormItem className='w-full'>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Enter Price" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          {/* Stock */}
          <FormField 
          control ={form.control}
          name="stock"
          render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'stock'>}) => (
            <FormItem className='w-full'>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input placeholder="Enter Stock" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        </div>
        <div className=" upload-field flex flex-col  md:flex-row gap-5">
          {/* Images */}

<FormField 
          control ={form.control}
          name="images"
          render={() => (
            <FormItem className='w-full'>
              <FormDescription>
    Upload up to 4 images. For best results, use square images (1:1 ratio) at least 800x800px.
  </FormDescription>
              <Card >
                <CardContent className='space-y-2 mt-2 min-h-48'>
                  <div className='flex-start space-x-2'>
                    {images.map((image: string) => (
                      <Image 
                      key={image}
                      src={image}
                      alt='product image'
                      className='w-20 h-20 object-cover object-center rounded-sm'
                      width={100}
                      height={100}
                      />
                    ))}
                    <FormControl>
         <UploadButton 
  endpoint='imageUploader' 
  appearance={{
    button: {
      background: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      padding: "0.5rem 1rem",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    allowedContent: {
      color: "hsl(var(--muted-foreground))",
    },
  }}
  onClientUploadComplete={(res: {url: string}[]) => {
    form.setValue('images', [...images, res[0].url])
  }}
  onUploadError={(error: Error) => {
    toast.error(`Error! ${error.message}`)
  }}
/>
                    </FormControl>
                  </div>
                </CardContent>
              </Card>
              <FormMessage />
            </FormItem>
          )}
          />

        </div>
        
          
        <div>
          <FormField 
          control ={form.control}
          name="description"
          render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'description'>}) => (
            <FormItem className='w-full'>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Product Description" className='resize-none' {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          /></div>
        <div>
          <Button 
  type='submit' 
  size='lg' 
  disabled={form.formState.isSubmitting} 
  className="button col-2 w-full"
  onClick={() => {
    console.log("Button clicked!");
    console.log("Form errors:", form.formState.errors);
    console.log("Form values:", form.getValues());
    console.log("Is form valid?", form.formState.isValid);
  }}
>
  {form.formState.isSubmitting ? "Submitting" : `${type} Product`}
</Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
