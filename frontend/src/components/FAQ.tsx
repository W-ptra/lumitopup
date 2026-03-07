import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    question: "Bagaimana cara melakukan pembelian?",
    answer:
      "Pilih game, pilih produk yang diinginkan, masukkan UID dan server, lalu pilih metode pembayaran dan klik Bayar.",
  },
  {
    question: "Apakah transaksi aman?",
    answer:
      "Ya. Semua pembayaran diproses melalui payment gateway pihak ketiga (Mayar) yang aman dan terpercaya.",
  },
  {
    question: "Berapa lama proses top up?",
    answer:
      "Proses biasanya berlangsung beberapa menit setelah pembayaran berhasil.",
  },
  {
    question: "Apakah saya perlu login?",
    answer:
      "Login tidak wajib, namun disarankan untuk mempermudah pelacakan transaksi.",
  },
];

function FAQ() {
  const [isOpen, setIsOpen] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white border rounded-2xl overflow-hidden">
      {/* MAIN FAQ HEADER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-6 py-4 text-left
          transition
          ${isOpen ? "bg-[#7491F7]/10 text-[#7491F7]" : "bg-white"}
        `}
      >
        <h2 className="text-lg font-semibold">FAQ</h2>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* COLLAPSIBLE CONTENT */}
      <div
        className={`grid transition-all duration-300 ease-in-out
          ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden px-6 pb-6 space-y-3">
          {faqData.map((item, index) => {
            const active = openIndex === index;

            return (
              <div
                key={index}
                className={`border rounded-xl transition
                  ${active ? "border-[#7491F7]" : "border-gray-200"}
                `}
              >
                <button
                  onClick={() =>
                    setOpenIndex(active ? null : index)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="font-medium text-sm">
                    {item.question}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300
                      ${active ? "rotate-180 text-[#7491F7]" : "text-gray-500"}
                    `}
                  />
                </button>

                {/* ANSWER (Animated) */}
                <div
                  className={`grid transition-all duration-300 ease-in-out
                    ${active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                  `}
                >
                  <div className="overflow-hidden px-4 pb-4 text-sm text-gray-600">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
