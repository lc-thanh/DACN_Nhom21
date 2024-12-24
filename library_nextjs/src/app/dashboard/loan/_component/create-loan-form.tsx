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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn, handleApiError, phoneFormatTest } from "@/lib/utils";
import {
  CreateLoanBody,
  CreateLoanBodyType,
} from "@/schemaValidations/loan.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { LoanBookType } from "@/schemaValidations/book.schema";
import PickedBooksTable from "@/app/dashboard/loan/_component/picked-books-table";
import { useDebouncedCallback } from "use-debounce";
import memberApiRequests from "@/apiRequests/member";
import { Skeleton } from "@/components/ui/skeleton";
import loanApiRequests from "@/apiRequests/loan";

export default function CreateLoanForm({
  pickedBooks,
  setPickedBooks,
}: {
  pickedBooks: LoanBookType[];
  setPickedBooks: React.Dispatch<React.SetStateAction<LoanBookType[]>>;
}) {
  const [loading, setLoading] = useState(false);
  const [loadingFetchMember, setLoadingFetchMember] = useState(false);
  const [memberName, setMemberName] = useState<string>("");

  const form = useForm<CreateLoanBodyType>({
    resolver: zodResolver(CreateLoanBody),
    defaultValues: {
      memberPhone: "",
      bookIdAndQuantity: [],
      dueDate: new Date(),
    },
  });

  useEffect(() => {
    form.setValue(
      "bookIdAndQuantity",
      pickedBooks.map((book) => `${book.book.id}#${book.quantity}`)
    );
    if (pickedBooks.length !== 0) {
      form.trigger("bookIdAndQuantity");
    }
  }, [form, pickedBooks]);

  async function onSubmit(values: CreateLoanBodyType) {
    try {
      setLoading(true);
      console.log(">>> check", values);
      await loanApiRequests.create(values);
      toast.success("Tạo phiếu mượn thành công!");
    } catch (error) {
      handleApiError({ error, toastMessage: "Tạo phiếu mượn thất bại!" });
    } finally {
      setLoading(false);
    }
  }

  const fetchMember = async (phone: string) => {
    try {
      setLoadingFetchMember(true);
      const { payload } = await memberApiRequests.findByPhone(phone);
      if (payload?.fullName) {
        setMemberName(payload.fullName);
      }
    } catch (_error) {
      setMemberName("");
    } finally {
      setLoadingFetchMember(false);
    }
  };

  const handleSearch = useDebouncedCallback(() => {
    setMemberName("");
    const phone = form.getValues("memberPhone");
    if (!phoneFormatTest(phone)) {
      return;
    }
    fetchMember(phone);
  }, 500);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="memberPhone"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>
                    Số điện thoại <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập số điện thoại"
                      {...fieldProps}
                      onChange={(e) => {
                        onChange(e);
                        handleSearch();
                      }}
                      className="w-[250px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Họ tên</FormLabel>
              <FormControl>
                {loadingFetchMember ? (
                  <Skeleton className="h-9 w-[250px]" />
                ) : (
                  <Input
                    placeholder=""
                    className="w-[250px]"
                    value={memberName}
                    disabled={memberName === ""}
                    onChange={(e) => {
                      e.preventDefault();
                    }}
                  />
                )}
              </FormControl>
            </FormItem>
          </div>

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="py-1">
                  Ngày trả <span className="text-destructive">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          <span>
                            {format(field.value, "dd/MM/yyyy")} (
                            {Math.ceil(
                              (field.value.getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            ngày)
                          </span>
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bookIdAndQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="scroll-m-20 mt-10 mb-4 text-md font-semibold tracking-tight">
                Các sách đã chọn
              </FormLabel>
              <PickedBooksTable
                pickedBooks={pickedBooks}
                setPickedBooks={setPickedBooks}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2 flex justify-end">
          <Button type="submit" className="w-[100px] mt-2" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Xác nhận
          </Button>
        </div>
      </form>
    </Form>
  );
}
