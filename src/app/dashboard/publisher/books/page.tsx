"use client";

import { useState } from "react";
import { Card, StatusBadge, Table, Td } from "@/components/ui/cards";

const INITIAL_BOOKS = [
  { id: "1", title: "The Quantum Garden", author: "Dr. Elara Voss", genre: "Sci-Fi", isbn: "978-0-13-468599-1", formats: ["Hardcover", "Paperback", "Ebook"], published: "2024-09-15", price: "$24.99", status: "published" },
  { id: "2", title: "The Last Algorithm", author: "Alex Park", genre: "Thriller", isbn: "978-0-13-468601-4", formats: ["Hardcover", "Paperback"], published: "2024-11-01", price: "$22.99", status: "published" },
  { id: "3", title: "Code Red: Silicon Valley", author: "Alex Park", genre: "Thriller", isbn: "978-0-13-468604-5", formats: ["Hardcover"], published: "2025-01-10", price: "$24.99", status: "published" },
  { id: "4", title: "Whispers of the Forgotten", author: "Sarah Chen", genre: "Fantasy", isbn: "978-0-13-468602-1", formats: ["Paperback"], published: "-", price: "$16.99", status: "in_review" },
];

export default function BooksPage() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "Fiction",
    isbn: "",
    formats: "Paperback",
    published: "-",
    price: "",
    status: "in_review",
  });

  function handleAddBook(e: React.FormEvent) {
    e.preventDefault();
    const newBook = {
      id: String(books.length + 1),
      title: form.title,
      author: form.author,
      genre: form.genre,
      isbn: form.isbn,
      formats: form.formats.split(",").map((f) => f.trim()),
      published: form.published,
      price: form.price,
      status: form.status,
    };
    setBooks([newBook, ...books]);
    setShowModal(false);
    setForm({
      title: "",
      author: "",
      genre: "Fiction",
      isbn: "",
      formats: "Paperback",
      published: "-",
      price: "",
      status: "in_review",
    });
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">📚 Books</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Add Book
        </button>
      </div>

      <Card>
        <Table headers={["Title", "Author", "Genre", "ISBN", "Formats", "Published", "Price", "Status"]}>
          {books.map((book) => (
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

      {/* Add Book Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add New Book</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Author</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Genre</label>
                  <select
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Fiction</option>
                    <option>Sci-Fi</option>
                    <option>Fantasy</option>
                    <option>Thriller</option>
                    <option>Literary</option>
                    <option>Non-Fiction</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">ISBN</label>
                  <input
                    type="text"
                    value={form.isbn}
                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Formats (comma separated)
                </label>
                <input
                  type="text"
                  value={form.formats}
                  onChange={(e) => setForm({ ...form, formats: e.target.value })}
                  placeholder="Hardcover, Paperback, Ebook"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Price</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="$19.99"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review</option>
                    <option value="in_production">In Production</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}