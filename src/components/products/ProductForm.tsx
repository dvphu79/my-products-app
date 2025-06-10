import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormValues } from '@/lib/schemas';
import { type IProduct } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea component exists
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: ProductFormValues, imageFile?: File, oldImageId?: string) => Promise<void>;
  initialData?: IProduct | null;
  mode: 'add' | 'edit';
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
      image: undefined,
    },
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.reset({
        name: initialData.name,
        category: initialData.category,
        price: initialData.price,
        stock: initialData.stock,
        description: initialData.description || '',
        image: undefined, // Image is handled separately for updates
      });
      setImagePreview(initialData.imageUrl || null);
    } else {
      form.reset({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        description: '',
        image: undefined,
      });
      setImagePreview(null);
    }
  }, [isOpen, mode, initialData, form]);

  const handleFormSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    const imageFile = data.image?.[0];
    await onSubmit(data, imageFile, initialData?.imageId);
    setIsSubmitting(false);
    if (!form.formState.errors || Object.keys(form.formState.errors).length === 0) {
      onOpenChange(false); // Close sheet on successful submission if no errors
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      form.setValue('image', event.target.files);
    } else {
      setImagePreview(initialData?.imageUrl || null); // Revert to initial if selection cleared
      form.setValue('image', undefined);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className='sm:max-w-lg'>
        <SheetHeader>
          <SheetTitle>{mode === 'add' ? 'Add New Product' : 'Edit Product'}</SheetTitle>
          <SheetDescription>
            {mode === 'add'
              ? 'Fill in the details for the new product.'
              : 'Update the product details.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          {/*
            The SheetContent is a flex-col container. The SheetHeader takes its space.
            This form will take the remaining available vertical space (flex-1) and scroll if its content overflows.
          */}
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className='flex-1 space-y-4 overflow-y-auto p-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  {' '}
                  <FormLabel>Name</FormLabel>{' '}
                  <FormControl>
                    <Input {...field} />
                  </FormControl>{' '}
                  <FormMessage />{' '}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  {' '}
                  <FormLabel>Category</FormLabel>{' '}
                  <FormControl>
                    <Input {...field} />
                  </FormControl>{' '}
                  <FormMessage />{' '}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  {' '}
                  <FormLabel>Price</FormLabel>{' '}
                  <FormControl>
                    <Input type='number' step='1' {...field} />
                  </FormControl>{' '}
                  <FormMessage />{' '}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stock'
              render={({ field }) => (
                <FormItem>
                  {' '}
                  <FormLabel>Stock</FormLabel>{' '}
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>{' '}
                  <FormMessage />{' '}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  {' '}
                  <FormLabel>Description (Optional)</FormLabel>{' '}
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>{' '}
                  <FormMessage />{' '}
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <Input type='file' accept='image/*' onChange={handleImageChange} />
              </FormControl>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt='Preview'
                  className='mt-2 h-24 w-24 rounded-md object-cover'
                />
              )}
              <FormMessage>{form.formState.errors.image?.message}</FormMessage>
            </FormItem>
            <SheetFooter className='pt-6'>
              <SheetClose asChild>
                <Button type='button' variant='outline'>
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type='submit'
                disabled={
                  isSubmitting ||
                  (mode === 'edit' && !form.formState.isDirty && !form.getValues('image'))
                }
              >
                {isSubmitting
                  ? mode === 'add'
                    ? 'Adding...'
                    : 'Saving...'
                  : mode === 'add'
                    ? 'Add Product'
                    : 'Save Changes'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
