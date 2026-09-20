"use client";

import { Card, StatusBadge, Table, Td } from "@/components/ui/cards";

const BOOKS = [
  { id: "1", title: "The Quantum Garden", author: "Dr. Elara Voss", genre: "Sci-Fi", isbn: "978-0-13-468599-1", formats: ["Hardcover", "Paperback", "Ebook"], published: "2024-09-15", price: "$24.99", status: "published" },
  { id: "2", title: "The Last Algorithm", author: "Alex Park", genre: "Thriller", isbn: "978-0-13-468601-4", formats: ["Hardcover", "Paperback"], published: "2024-11-01", price: "$22.99", status: "published" },
  { id: "3", title: "Code Red: Silicon Valley", author: "Alex Park", genre: "Thriller", isbn: "978-0-13-468604-5", formats: ["Hardcover"], published: "2025-01-10", price: "$24.99", status: "published" },
  { id: "4", title: "Whispers of the Forgotten", author: "Sarah Chen", genre: "Fantasy", isbn: "978-0-13-468602-1", formats: ["Paperback"], published: "-", price: "$16.99", status: "in_review" },
  { id: "5", title: "Midnight in Marrakech", author: "Omar Hassan", genre: "Thriller", isbn: "978-0-13-468603-8", formats: ["Paperback"], published: "-", price: "$13.99", status: "in_production" },
  { id: "6", title: "Beneath the Willow", author: "Maria Garcia", genre: "Literary", isbn: "978-0-13-468605-2", formats: ["Ebook"], published: "-", price: "$9.99", status: "approved" },
];

export default function BooksPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">📚 Books</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Add Book
        </button>
      </div>
      <Card>
        <Table headers={["Title", "Author", "Genre", "ISBN", "Formats", "Published", "Price", "Status"]}>
          {BOOKS.map((book) => (
            <tr key={book.id} className="table-row-hover cursor-pointer">
              <Td className="font-medium text-slate-900">{book.title}</Td>
              <Td>{book.author}</Td>
              <Td>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{book.genre}</span>
              </Td>
              <Td className="font-mono text-xs">{book.isbn}</Td>
              <Td>
                <div className="flex gap-1 flex-wrap">
                  {book.formats.map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">{f}</span>
                  ))}
                </div>
              </Td>
              <Td className="text-sm text-slate-500">{book.published}</Td>
              <Td className="font-mono">{book.price}</Td>
              <Td><StatusBadge status={book.status} /></Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}