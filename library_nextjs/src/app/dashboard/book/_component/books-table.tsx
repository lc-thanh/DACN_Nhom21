import React from "react";

interface BooksTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof >>,
    ]
  >
}

export default function BooksTable() {
  return <div>BooksTable</div>;
}
