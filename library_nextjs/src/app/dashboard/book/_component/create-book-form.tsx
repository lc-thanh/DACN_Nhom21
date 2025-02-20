"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateBookBody,
  CreateBookBodyType,
} from "@/schemaValidations/book.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CategoryType } from "@/schemaValidations/category.schema";
import categoryApiRequests from "@/apiRequests/category";
import bookApiRequests from "@/apiRequests/book";
import { handleApiError } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CurrencyInput from "@/components/money-input";

export default function CreateBookForm() {
  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [{ payload: categories }] = await Promise.all([
          categoryApiRequests.getCategories(),
        ]);
        setCategories(categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSelectData();
  }, []);

  const form = useForm<CreateBookBodyType>({
    resolver: zodResolver(CreateBookBody),
    defaultValues: {
      title: "",
      publisher: "",
      description: "",
      authorName: "",
      price: 0,
      quantity: 0,
      totalPages: 0,
    },
  });

  async function onSubmit(values: CreateBookBodyType) {
    try {
      setLoading(true);
      console.log(values);

      // await bookApiRequests.create(values);
      // toast.success("Tạo sách mới thành công!");
      // router.push("/dashboard/book");
    } catch (error) {
      handleApiError({ error, toastMessage: "Tạo sách thất bại!" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
        className="space-y-3 w-full lg:grid grid-cols-2 gap-6"
      >
        <div className="space-y-3">
          <div className="space-y-3 flex flex-col items-center">
            <FormLabel>Ảnh bìa</FormLabel>
            <Image
              src={
                imageUpload
                  ? URL.createObjectURL(imageUpload)
                  : "/book/null.png"
              }
              width={150}
              height={0}
              alt="Ảnh xem trước bìa sách"
            />

            <div className="flex flex-row space-x-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setImageUpload(null);
                  form.setValue("image", undefined);
                }}
              >
                <Trash2 />
                Xóa ảnh
              </Button>
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange } }) => (
                  <FormItem className="w-fit">
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (event) => {
                            const file = (event.target as HTMLInputElement)
                              .files?.[0];
                            if (file) {
                              onChange(file);
                              setImageUpload(file);
                            }
                          };
                          input.click();
                        }}
                      >
                        <ImageUp />
                        Chọn ảnh
                      </Button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tiêu đề sách <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề sách" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>
                  Giá bìa <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <Input
                      className="hidden"
                      placeholder="Nhập giá bìa"
                      type="number"
                      {...fieldProps}
                    />
                    <CurrencyInput onChange={(number) => onChange(number)} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalPages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số trang <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập số trang sách"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số lượng <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số lượng" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3 flex flex-col justify-between">
          <FormField
            control={form.control}
            name="publisher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhà xuất bản</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập nhà xuất bản" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publishedYear"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Năm xuất bản</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập năm xuất bản"
                    type="number"
                    onChange={(e) => {
                      onChange(e);
                    }}
                    {...fieldProps}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tác giả</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên tác giả" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookShelfId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngăn sách</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngăn sách" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea placeholder="Nhập mô tả sách" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-2 !mt-6 flex flex-row space-x-2 justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-[100px]"
            onClick={() => {
              router.back();
            }}
          >
            Hủy
          </Button>
          <Button type="submit" className="w-[100px]" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Xác nhận
          </Button>
        </div>
      </form>
    </Form>
  );
}
