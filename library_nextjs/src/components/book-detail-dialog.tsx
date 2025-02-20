// https://v0.dev/chat/d3N3EWTSW4Z
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableCell } from "@/components/ui/table";
import { BookType } from "@/schemaValidations/book.schema";
import Image from "next/image";

interface BookDialogProps {
  book: BookType;
}

export function BookDetailDialog({ book }: BookDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableCell className="min-w-[150px] font-medium hover:cursor-pointer hover:underline">
          {book.title}
        </TableCell>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{book.title}</DialogTitle>
          <DialogDescription>
            Tác giả: {book.authorName} | Năm xuất bản: {book.publishedYear}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Image
                src={book.imageUrl}
                alt={book.title}
                width={200}
                height={400}
                className="object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold">Giá bìa</h3>
                <p>{book.price.toLocaleString("de-DE") + " đ"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Số lượng sách</h3>
                <p>
                  Còn {book.availableQuantity}/{book.quantity}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Nhà xuất bản</h3>
                <p>{book.publisher}</p>
              </div>
              <div>
                <h3 className="font-semibold">Tổng số trang</h3>
                <p>{book.totalPages}</p>
              </div>
              <div>
                <h3 className="font-semibold">Danh mục</h3>
                <p>{book.categoryName}</p>
              </div>
              <div>
                <h3 className="font-semibold">Ngăn sách</h3>
                <p>{book.bookShelfName}</p>
              </div>
              <div>
                <h3 className="font-semibold">Mô tả</h3>
                <p className="text-sm text-muted-foreground">
                  {book.description}
                </p>
              </div>
            </div>
          </div>
          {/* <div className="mt-4 text-sm text-muted-foreground">
            <p>Book ID: {book.id}</p>
            <p>Category ID: {book.categoryId}</p>
            <p>Bookshelf ID: {book.bookShelfId}</p>
            <p>Created on: {new Date(book.createdOn).toLocaleDateString()}</p>
          </div> */}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
