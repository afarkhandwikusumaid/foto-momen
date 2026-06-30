import React from 'react';

interface BookingRecord {
  id: string;
  name: string;
  email: string;
  eventDate: string;
  eventType: string;
  notes: string;
  createdAt: number;
}

interface BookingManagerProps {
  bookings: BookingRecord[];
}

export default function BookingManager({ bookings }: BookingManagerProps) {
  return (
    <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-stone-900">Form Pemesanan Masuk</h3>
        <p className="text-xs text-stone-500 mt-1">Kelola data pemesanan photobooth fisik yang masuk dari formulir reservasi halaman profile.</p>
      </div>

      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 hide-scrollbar">
        {bookings.map((book) => (
          <div 
            key={book.id} 
            className="p-5 border border-stone-200 rounded-xl bg-[#faf8f6]/50 hover:bg-[#faf8f6] transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-200/50 pb-2.5">
              <div>
                <h4 className="text-xs font-black text-stone-850">{book.name}</h4>
                <span className="text-[10px] text-stone-450 font-medium font-mono">{book.email}</span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] bg-white border border-[#e6dfd5] text-[#b38e86] px-2.5 py-1 rounded-md font-bold inline-block">
                  {book.eventType}
                </span>
                <span className="text-[9px] text-stone-400 block mt-1 font-mono">
                  Tanggal Acara: {new Date(book.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="text-xs leading-relaxed text-stone-600 font-medium">
              <strong className="text-stone-800 font-bold block mb-1">Catatan / Detail Acara:</strong> 
              <span className="bg-white p-2.5 rounded border border-stone-100 block italic">{book.notes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
