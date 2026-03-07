import MainLayout from "../layouts/MainLayout";

function PrivacyPolicy() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">
        <h1 className="text-2xl font-semibold text-[#7491F7] mb-6">
          Kebijakan Privasi
        </h1>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            Kebijakan Privasi ini menjelaskan bagaimana <strong>LumiTopUp</strong>
            (“kami”) mengumpulkan, menggunakan, dan melindungi informasi Anda
            saat Anda mengakses atau menggunakan platform kami. Dengan
            menggunakan layanan kami, Anda menyetujui pengumpulan dan
            penggunaan informasi sesuai dengan kebijakan ini.
          </p>

          {/* 1 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              1. Informasi yang Kami Kumpulkan
            </h2>
            <p>
              Kami hanya mengumpulkan informasi yang diperlukan untuk
              menyediakan dan meningkatkan layanan kami, termasuk:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Alamat email</strong> (opsional), jika diberikan oleh
                pengguna
              </li>
              <li>
                <strong>Data transaksi</strong>, seperti detail pesanan, status
                pembayaran, dan waktu transaksi
              </li>
            </ul>
            <p className="mt-2">
              Kami tidak mengumpulkan data pribadi sensitif di luar yang
              diperlukan untuk operasional layanan.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              2. Autentikasi dan Login
            </h2>
            <p>
              Kami menggunakan <strong>Google OAuth</strong> sebagai metode
              autentikasi yang aman. Saat Anda login menggunakan Google, kami
              dapat menerima informasi profil dasar (seperti alamat email)
              sesuai dengan izin yang Anda berikan melalui akun Google Anda.
            </p>
            <p className="mt-2">
              Kami tidak menyimpan kata sandi akun Google Anda dan tidak
              mengakses data lain di luar yang diperlukan untuk proses login.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              3. Pemrosesan Pembayaran
            </h2>
            <p>
              Seluruh proses pembayaran ditangani oleh penyedia layanan pihak
              ketiga (“<strong>Payment Gateway</strong>”). Kami tidak menyimpan
              atau memproses informasi kartu pembayaran atau data perbankan
              Anda di sistem kami.
            </p>
            <p className="mt-2">
              Payment Gateway beroperasi secara independen dan bertanggung
              jawab atas keamanan data pembayaran sesuai dengan kebijakan
              privasi dan standar industri mereka masing-masing.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              4. Penggunaan Informasi
            </h2>
            <p>
              Informasi yang dikumpulkan digunakan untuk tujuan berikut:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Memproses dan mengelola transaksi</li>
              <li>Mengautentikasi pengguna dan mengelola akun</li>
              <li>Meningkatkan kinerja dan keandalan platform</li>
              <li>Menyediakan dukungan pelanggan dan pembaruan layanan</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              5. Keamanan Data
            </h2>
            <p>
              Kami menerapkan langkah-langkah administratif, teknis, dan
              organisasi yang wajar untuk melindungi data Anda dari akses,
              penggunaan, atau pengungkapan yang tidak sah.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              6. Pembagian Data
            </h2>
            <p>
              Kami tidak menjual, menyewakan, atau memperdagangkan data pribadi
              Anda kepada pihak ketiga. Data hanya dapat dibagikan kepada
              penyedia layanan tepercaya sejauh diperlukan untuk menjalankan
              layanan atau memenuhi kewajiban hukum.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              7. Hak Pengguna
            </h2>
            <p>
              Anda berhak untuk meminta akses, perbaikan, atau penghapusan data
              pribadi Anda sesuai dengan peraturan perundang-undangan yang
              berlaku.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              8. Perubahan Kebijakan Privasi
            </h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
              Setiap perubahan akan berlaku segera setelah dipublikasikan di
              halaman ini.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              9. Hubungi Kami
            </h2>
            <p>
              Jika Anda memiliki pertanyaan terkait Kebijakan Privasi ini,
              silakan hubungi kami melalui saluran komunikasi resmi kami.
            </p>
          </section>

          <p className="text-xs text-gray-400 pt-4">
            Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

export default PrivacyPolicy;
