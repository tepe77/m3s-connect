import type { Metadata } from "next";
import { KontakClient } from "./KontakClient";

export const metadata: Metadata = {
  title: "Kontak & Sekretariat | IKAMAYOGA - Ikatan Alumni MAN 3 Sleman",
  description:
    "Hubungi Sekretariat IKAMAYOGA (Ikatan Alumni MAN 3 Sleman Yogyakarta) untuk permohonan legalisir ijazah, verifikasi akun alumni, donasi, dan informasi reuni.",
};

export default function KontakPage() {
  return <KontakClient />;
}
