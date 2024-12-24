import { QuantityInput } from "@/components/quantity-input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoanBookType } from "@/schemaValidations/book.schema";
import { Minus } from "lucide-react";
import Image from "next/image";

export default function PickedBooksTable({
  pickedBooks,
  setPickedBooks,
}: {
  pickedBooks: LoanBookType[];
  setPickedBooks: React.Dispatch<React.SetStateAction<LoanBookType[]>>;
}) {
  const handleUnpickBook = (bookId: string) => {
    setPickedBooks((prevPickedBooks: LoanBookType[]) =>
      prevPickedBooks.filter((loanBook) => loanBook.book.id !== bookId)
    );
  };

  const handleChangeQuantity = (bookId: string, quantity: number) => {
    setPickedBooks((prevPickedBooks: LoanBookType[]) =>
      prevPickedBooks.map((loanBook) =>
        loanBook.book.id === bookId ? { ...loanBook, quantity } : loanBook
      )
    );
  };

  return (
    <Table className="text-center border">
      {/* <TableCaption>Hãy chọn sách để mượn</TableCaption> */}
      <TableHeader>
        <TableRow className="bg-primary-foreground">
          <TableHead className="text-center border-y">#</TableHead>
          <TableHead className="text-center border">Tiêu đề</TableHead>
          <TableHead className="text-center border">Ảnh</TableHead>
          <TableHead className="text-center border">Hiện có</TableHead>
          <TableHead className="text-center border">Số trang</TableHead>
          <TableHead className="text-center border">Tác giả</TableHead>
          <TableHead className="text-center border">Danh mục</TableHead>
          <TableHead className="text-center border">Ngăn sách</TableHead>
          <TableHead className="text-center border">Nhà xuất bản</TableHead>
          <TableHead className="text-center border">Năm XB</TableHead>
          <TableHead className="text-center border">Số lượng</TableHead>
          <TableHead className="text-center border">Bỏ chọn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pickedBooks?.map((loanBook: LoanBookType, index) => (
          <TableRow key={loanBook.book.id}>
            <TableCell>{`${index + 1}.`}</TableCell>
            <TableCell className="min-w-[150px] font-medium">
              {loanBook.book.title}
            </TableCell>
            <TableCell className="w-[150px] min-w-[100px]">
              <Image
                src={loanBook.book.imageUrl}
                width={150}
                height={0}
                alt="Book cover image"
              />
            </TableCell>
            <TableCell>{loanBook.book.availableQuantity}</TableCell>
            <TableCell>{loanBook.book.totalPages}</TableCell>
            <TableCell>{loanBook.book.authorName}</TableCell>
            <TableCell>{loanBook.book.categoryName}</TableCell>
            <TableCell>{loanBook.book.bookShelfName}</TableCell>
            <TableCell>{loanBook.book.publisher}</TableCell>
            <TableCell>{loanBook.book.publishedYear}</TableCell>
            <TableCell>
              <div className="flex flex-row h-full justify-center">
                <QuantityInput
                  initialValue={loanBook.quantity}
                  max={loanBook.book.availableQuantity}
                  min={1}
                  step={1}
                  onChange={(value) => {
                    handleChangeQuantity(loanBook.book.id, value);
                  }}
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row h-full justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    handleUnpickBook(loanBook.book.id);
                  }}
                  className="border-red-500 hover:bg-red-50"
                >
                  <Minus className="text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={10} className="text-right pe-20">
            Tổng
          </TableCell>
          <TableCell colSpan={1} className="text-center pe-2">
            {pickedBooks.reduce(
              (total, loanBook) => total + loanBook.quantity,
              0
            )}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
