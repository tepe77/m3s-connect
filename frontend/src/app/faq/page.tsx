import type { Metadata } from "next";
import { FaqTwoColumn } from "@/components/blocks/faq-two-column";

export const metadata: Metadata = {
  title: "FAQ | IKAMAYOGA - Ikatan Alumni MAN 3 Sleman",
  description:
    "Pertanyaan yang sering diajukan seputar pendaftaran, verifikasi alumni, privasi data, dan keikutsertaan dalam forum komunitas IKAMAYOGA.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <FaqTwoColumn />
    </div>
  );
}
