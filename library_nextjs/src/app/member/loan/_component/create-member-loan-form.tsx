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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn, handleApiError } from "@/lib/utils";
import {
  MemberCreateLoanBody,
  MemberCreateLoanBodyType,
} from "@/schemaValidations/loan.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { LoanBookType } from "@/schemaValidations/book.schema";
import PickedBooksTable from "@/app/dashboard/loan/_component/picked-books-table";
import loanApiRequests from "@/apiRequests/loan";

export default function CreateMemberLoanForm({
  pickedBooks,
  setPickedBooks,
}: {
  pickedBooks: LoanBookType[];
  setPickedBooks: React.Dispatch<React.SetStateAction<LoanBookType[]>>;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<MemberCreateLoanBodyType>({
    resolver: zodResolver(MemberCreateLoanBody),
    defaultValues: {
      bookIdAndQuantity: [],
      loanDate: new Date(),
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

  async function onSubmit(values: MemberCreateLoanBodyType) {
    try {
      setLoading(true);
      console.log(">>> check", values);
      await loanApiRequests.memberCreateLoan(values);
      toast.success("Yêu cầu phiếu mượn thành công!");
    } catch (error) {
      handleApiError({ error, toastMessage: "Yêu cầu phiếu mượn thất bại!" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="loanDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="py-1">
                  Ngày mượn <span className="text-destructive">*</span>
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
                          <span>{format(field.value, "dd/MM/yyyy")}</span>
                        ) : (
                          <span>Chọn ngày mượn</span>
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
                              (field.value.getTime() -
                                form.getValues("loanDate").getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            ngày)
                          </span>
                        ) : (
                          <span>Chọn ngày trả</span>
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
                      disabled={(date) => date < form.getValues("loanDate")}
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
