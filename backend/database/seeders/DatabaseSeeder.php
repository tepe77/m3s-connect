<?php

namespace Database\Seeders;

use App\Enums\EventStatus;
use App\Enums\ForumThreadStatus;
use App\Enums\NewsStatus;
use App\Enums\ProfileVisibility;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\AlumniEducation;
use App\Models\AlumniExperience;
use App\Models\AlumniProfile;
use App\Models\AlumniSocialLink;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\ForumCategory;
use App\Models\ForumPost;
use App\Models\ForumThread;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\NewsComment;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Roles & Initial Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@m3s-connect.id'],
            [
                'name' => 'Administrator M3S',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ADMIN,
                'status' => UserStatus::ACTIVE,
                'email_verified_at' => now(),
            ]
        );

        $moderator = User::firstOrCreate(
            ['email' => 'moderator@m3s-connect.id'],
            [
                'name' => 'Moderator Komunitas',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::MODERATOR,
                'status' => UserStatus::ACTIVE,
                'email_verified_at' => now(),
            ]
        );

        $alumni1 = User::firstOrCreate(
            ['email' => 'budi.santoso@alumni.m3s.id'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::ACTIVE,
                'email_verified_at' => now(),
            ]
        );

        $alumni2 = User::firstOrCreate(
            ['email' => 'siti.rahmawati@alumni.m3s.id'],
            [
                'name' => 'Siti Rahmawati',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::ACTIVE,
                'email_verified_at' => now(),
            ]
        );

        // 2. Alumni Profiles
        $profile1 = AlumniProfile::firstOrCreate(
            ['user_id' => $alumni1->id],
            [
                'graduation_year' => 2018,
                'graduation_class' => 'IPA 2',
                'alumni_identifier' => 'M3S-2018-0042',
                'gender' => 'male',
                'birth_date' => '2000-05-14',
                'bio' => 'Software Engineer antusias dalam pengembangan sistem web terdistribusi dan open-source.',
                'current_city' => 'Yogyakarta',
                'current_country' => 'Indonesia',
                'occupation' => 'Senior Backend Engineer',
                'company' => 'Tech Nusantara',
                'visibility' => ProfileVisibility::PUBLIC,
                'verified_at' => now(),
            ]
        );

        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile1->id, 'institution' => 'Universitas Gadjah Mada'],
            [
                'degree' => 'S1',
                'field_of_study' => 'Teknologi Informasi',
                'start_year' => 2018,
                'end_year' => 2022,
                'description' => 'Lulus Cumlaude dengan fokus riset arsitektur cloud.',
            ]
        );

        AlumniExperience::firstOrCreate(
            ['alumni_profile_id' => $profile1->id, 'company' => 'Tech Nusantara'],
            [
                'position' => 'Senior Backend Engineer',
                'location' => 'Yogyakarta',
                'start_date' => '2022-07-01',
                'end_date' => null,
                'is_current' => true,
                'description' => 'Mengembangkan backend API mikroservis dan integrasi payment gateway.',
            ]
        );

        AlumniSocialLink::firstOrCreate(
            ['alumni_profile_id' => $profile1->id, 'platform' => 'github'],
            ['url' => 'https://github.com/budisantoso']
        );

        $profile2 = AlumniProfile::firstOrCreate(
            ['user_id' => $alumni2->id],
            [
                'graduation_year' => 2019,
                'graduation_class' => 'IPS 1',
                'alumni_identifier' => 'M3S-2019-0115',
                'gender' => 'female',
                'birth_date' => '2001-09-21',
                'bio' => 'Digital Marketer & Community Manager yang berfokus pada edukasi publik dan branding UMKM.',
                'current_city' => 'Jakarta Selatan',
                'current_country' => 'Indonesia',
                'occupation' => 'Brand Strategist',
                'company' => 'Kreatif Media Asia',
                'visibility' => ProfileVisibility::MEMBERS,
                'verified_at' => now(),
            ]
        );

        // 3. Skills
        $skillNames = ['Laravel', 'PostgreSQL', 'Redis', 'Next.js', 'React', 'TypeScript', 'Digital Marketing', 'Public Relations'];
        $skills = [];
        foreach ($skillNames as $name) {
            $skills[] = Skill::firstOrCreate(
                ['name' => $name],
                ['slug' => Str::slug($name)]
            );
        }

        $profile1->skills()->syncWithoutDetaching([$skills[0]->id, $skills[1]->id, $skills[2]->id, $skills[3]->id]);
        $profile2->skills()->syncWithoutDetaching([$skills[6]->id, $skills[7]->id]);

        // 4. Forum Categories (Synchronized with frontend portal)
        $forumCategories = [
            [
                'slug' => 'diskusi-umum',
                'name' => 'Diskusi Umum',
                'description' => 'Ruang silaturahmi santai, kabar antar angkatan, dan obrolan bebas warga Mayoga.',
                'color' => '#0D9488',
                'icon' => 'chat',
                'image' => 'forum-categories/hero-man3-sleman.jpg',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'slug' => 'karir-dan-profesi',
                'name' => 'Karir & Profesi',
                'description' => 'Lowongan kerja, info magang, review CV, dan peluang kolaborasi profesional alumni.',
                'color' => '#2563EB',
                'icon' => 'briefcase',
                'image' => 'forum-categories/news-internasional.jpg',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'slug' => 'kegiatan-dan-reuni',
                'name' => 'Kegiatan & Reuni',
                'description' => 'Agenda temu kangen akbar, bakti sosial ramadan, silaturahmi angkatan, dan kepanitiaan.',
                'color' => '#D97706',
                'icon' => 'calendar',
                'image' => 'forum-categories/news-reuni.jpg',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'slug' => 'beasiswa-dan-pendidikan',
                'name' => 'Beasiswa & Pendidikan',
                'description' => 'Informasi beasiswa S1/S2/S3 dalam dan luar negeri, tips seleksi, dan bimbingan studi.',
                'color' => '#7C3AED',
                'icon' => 'academic',
                'image' => 'forum-categories/news-beasiswa.jpg',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'slug' => 'bisnis-dan-umkm',
                'name' => 'Bisnis & UMKM',
                'description' => 'Etalase usaha alumni, kemitraan rantai pasok, dan sharing strategi wirausaha.',
                'color' => '#059669',
                'icon' => 'store',
                'image' => 'forum-categories/news-peluncuran.jpg',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'slug' => 'teknologi-dan-inovasi',
                'name' => 'Teknologi & Digital',
                'description' => 'Diskusi rekayasa perangkat lunak, AI, cloud computing, dan inisiatif digital madrasah.',
                'color' => '#DC2626',
                'icon' => 'chip',
                'image' => 'forum-categories/doc-wisuda.jpg',
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        $categoriesMap = [];
        foreach ($forumCategories as $categoryData) {
            $categoriesMap[$categoryData['slug']] = ForumCategory::updateOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );
        }

        $catUmum = $categoriesMap['diskusi-umum'];
        $catKarir = $categoriesMap['karir-dan-profesi'];
        $catReuni = $categoriesMap['kegiatan-dan-reuni'];

        // 5. Initial Forum Threads
        $thread1 = ForumThread::firstOrCreate(
            ['slug' => 'reuni-akbar-lintas-angkatan-2026'],
            [
                'category_id' => $catReuni->id,
                'user_id' => $alumni1->id,
                'title' => 'Rencana Reuni Akbar Lintas Angkatan MAN 3 Sleman 2026',
                'body' => 'Assalamu’alaikum rekan-rekan alumni MAN 3 Sleman (Mayoga). Mari kita diskusikan agenda reuni akbar dan pembentukan panitia kerja untuk tahun ini. Silakan berikan tanggapan dan masukan tempat kegiatan.',
                'status' => ForumThreadStatus::PUBLISHED,
                'is_pinned' => true,
                'is_locked' => false,
                'views_count' => 128,
                'last_post_at' => now(),
            ]
        );

        ForumPost::firstOrCreate(
            ['thread_id' => $thread1->id, 'user_id' => $alumni2->id],
            [
                'body' => 'Wa’alaikumsalam wr wb. Usul yang sangat bagus Mas Budi. Angkatan 2019 siap berkolaborasi untuk kepanitiaan publikasi dan dokumentasi.',
                'status' => 'published',
            ]
        );

        // 6. News Categories (with Subcategories), News, and Comments
        $catKegiatan = NewsCategory::firstOrCreate(
            ['slug' => 'kegiatan-alumni'],
            ['name' => 'Kegiatan Alumni', 'description' => 'Agenda temu kangen, reuni akbar, dan silaturahmi alumni.']
        );

        $subCatReuni = NewsCategory::firstOrCreate(
            ['slug' => 'reuni-silaturahmi'],
            [
                'parent_id' => $catKegiatan->id,
                'name' => 'Reuni & Silaturahmi',
                'description' => 'Liputan kegiatan reuni akbar dan kumpul angkatan.'
            ]
        );

        $catBeasiswa = NewsCategory::firstOrCreate(
            ['slug' => 'beasiswa-pendidikan'],
            ['name' => 'Beasiswa & Pendidikan', 'description' => 'Bantuan studi, donasi pendidikan, dan beasiswa.']
        );

        $subCatStudi = NewsCategory::firstOrCreate(
            ['slug' => 'bantuan-studi-sarjana'],
            [
                'parent_id' => $catBeasiswa->id,
                'name' => 'Bantuan Studi Sarjana',
                'description' => 'Program dukungan biaya kuliah bagi alumni berprestasi.'
            ]
        );

        $catPrestasi = NewsCategory::firstOrCreate(
            ['slug' => 'prestasi-alumni'],
            ['name' => 'Prestasi Alumni', 'description' => 'Kiprah, capaian, dan inspirasi alumni madrasah di tingkat nasional dan global.']
        );

        $subCatGlobal = NewsCategory::firstOrCreate(
            ['slug' => 'kiprah-global'],
            [
                'parent_id' => $catPrestasi->id,
                'name' => 'Kiprah Global',
                'description' => 'Prestasi alumni di kancah internasional dan forum dunia.'
            ]
        );

        $catKomunitas = NewsCategory::firstOrCreate(
            ['slug' => 'informasi-komunitas'],
            ['name' => 'Informasi Komunitas', 'description' => 'Pengumuman resmi ikatan alumni, rilis platform, dan panduan anggota.']
        );

        $subCatPortal = NewsCategory::firstOrCreate(
            ['slug' => 'portal-digital'],
            [
                'parent_id' => $catKomunitas->id,
                'name' => 'Portal Digital',
                'description' => 'Pembaruan fitur platform M3S Connect dan layanan digital madrasah.'
            ]
        );

        // News 1
        $news1 = News::updateOrCreate(
            ['slug' => 'reuni-akbar-alumni-man-3-sleman-2025'],
            [
                'category_id' => $subCatReuni->id,
                'author_id' => $admin->id,
                'title' => 'Reuni Akbar Alumni MAN 3 Sleman 2025 Berlangsung Meriah',
                'excerpt' => 'Ribuan alumni dari berbagai angkatan hadir dalam acara Reuni Akbar yang digelar di halaman MAN 3 Sleman, mempererat silaturahmi dan merajut kolaborasi masa depan.',
                'content' => "<p>Suasana penuh kehangatan dan rasa haru mewarnai halaman kampus MAN 3 Sleman pada hari Minggu, 12 Mei 2025. Lebih dari 1.500 alumni dari angkatan 1990 hingga lulusan terbaru 2024 berkumpul kembali dalam gelaran akbar Reuni Akbar Alumni MAN 3 Sleman bertajuk <strong>'Satu Alumni, Seribu Cerita, Satu Tujuan'</strong>.</p><p>Acara dibuka secara resmi oleh Kepala Madrasah didampingi jajaran pengurus ikatan alumni. Dalam sambutannya, beliau menyampaikan apresiasi mendalam atas kontribusi nyata yang terus diberikan oleh para alumni di berbagai sektor, baik di dunia profesional, akademis, wirausaha, maupun pengabdian sosial kemasyarakatan.</p><p>Tidak hanya sekadar temu kangen mengenang masa-masa putih abu-abu di madrasah, Reuni Akbar 2025 juga diisi dengan peluncuran program Dana Abadi Pendidikan Beasiswa Mayoga serta inisiasi jejaring mentoring karir lintas angkatan.</p><p>Para peserta reuni disuguhi berbagai stan kilas balik foto lawas, bincang santai inspiratif, serta panggung seni kolaborasi antar angkatan yang disambut antusias oleh seluruh hadirin.</p><p>Ketua Panitia Pelaksana, Ahmad Fauzi, M.Pd. (Alumni 2010), menegaskan bahwa momentum reuni ini menjadi pijakan awal dari integrasi digital komunitas alumni melalui peluncuran platform M3S Connect, yang mempermudah koordinasi kegiatan dan pendataan anggota ke depannya.</p>",
                'cover_image' => 'news/covers/news-reuni.jpg',
                'content_images' => [
                    ['url' => '/images/news-reuni.jpg', 'caption' => 'Suasana kehangatan ribuan alumni MAN 3 Sleman saat pembukaan acara Reuni Akbar 2025.', 'alt' => 'Reuni Akbar'],
                    ['url' => '/images/doc-baksos.jpg', 'caption' => 'Penyerahan cenderamata bakti sosial dan donasi beasiswa pendidikan.', 'alt' => 'Bakti Sosial']
                ],
                'tags' => ['ReuniAkbar2025', 'AlumniMayoga', 'MAN3Sleman', 'SilaturahmiAlumni', 'KeluargaBesarM3S'],
                'status' => NewsStatus::PUBLISHED,
                'published_at' => now()->subDays(10),
            ]
        );

        // News 2 (supports frontend slug)
        $news2 = News::updateOrCreate(
            ['slug' => 'program-beasiswa-alumni-berprestasi'],
            [
                'category_id' => $subCatStudi->id,
                'author_id' => $moderator->id,
                'title' => 'Program Beasiswa untuk Alumni Berprestasi',
                'excerpt' => 'Ikatan Alumni MAN 3 Sleman resmi meluncurkan program beasiswa jenjang pendidikan tinggi bagi alumni dan siswa berprestasi yang membutuhkan dukungan operasional studi.',
                'content' => "<p>Sebagai wujud kepedulian antargenerasi, Ikatan Alumni MAN 3 Sleman membuka pendaftaran Beasiswa Alumni Berprestasi gelombang perdana tahun akademik 2025/2026. Program ini didanai melalui skema donasi teratur dan infak pendidikan para alumni.</p><p>Beasiswa ini mencakup tunjangan biaya operasional perkuliahan, bimbingan akademik dari alumni mentor senior, serta fasilitas jejaring magang kerja di berbagai perusahaan mitra komunitas.</p><p>Kriteria penerima difokuskan pada mahasiswa aktif yang memiliki rekam jejak akademik cemerlang, aktif berorganisasi, serta memerlukan dukungan finansial tambahan.</p><p>Pendaftaran dapat diakses secara daring melalui platform M3S Connect hingga tanggal 30 Mei 2025.</p>",
                'cover_image' => 'news/covers/news-beasiswa.jpg',
                'content_images' => [
                    ['url' => '/images/news-beasiswa.jpg', 'caption' => 'Simbolis penyerahan sertifikat beasiswa kepada mahasiswa berprestasi.', 'alt' => 'Beasiswa'],
                    ['url' => '/images/news-internasional.jpg', 'caption' => 'Sesi sosialisasi seleksi beasiswa luar negeri dan persiapan berkas.', 'alt' => 'Sosialisasi']
                ],
                'tags' => ['BeasiswaAlumni', 'PrestasiMayoga', 'PendidikanTinggi', 'DanaAbadi', 'MayogaPeduli'],
                'status' => NewsStatus::PUBLISHED,
                'published_at' => now()->subDays(14),
            ]
        );

        News::where('slug', 'program-beasiswa-untuk-alumni-berprestasi')->delete();

        // News 3
        $news3 = News::updateOrCreate(
            ['slug' => 'alumni-man-3-sleman-sukses-kancah-internasional'],
            [
                'category_id' => $subCatGlobal->id,
                'author_id' => $admin->id,
                'title' => 'Alumni MAN 3 Sleman Sukses di Kancah Internasional',
                'excerpt' => 'Kiprah membanggakan ditunjukkan lulusan madrasah yang tampil sebagai pembicara pada forum teknologi dan riset global di tingkat dunia.',
                'content' => "<p>Pendidikan komprehensif berbasis nilai agama dan wawasan sains di MAN 3 Sleman terus melahirkan generasi unggul yang diakui di kancah internasional. Kali ini kabar membanggakan datang dari salah satu alumnus yang diundang memaparkan riset kecerdasan buatan dalam forum ilmiah internasional.</p><p>Dalam sesi presentasinya, dipaparkan bagaimana implementasi teknologi adaptif dapat mempercepat pemerataan akses pendidikan berkualitas di negara berkembang.</p><p>Kunci dari capaian ini berakar pada ketekunan belajar, budaya membaca, dan bimbingan guru-guru madrasah yang selalu mendorong eksplorasi keilmuan tanpa batas.</p>",
                'cover_image' => 'news/covers/news-internasional.jpg',
                'content_images' => [
                    ['url' => '/images/news-internasional.jpg', 'caption' => 'Reza Pratama, alumnus MAN 3 Sleman, saat menyampaikan paparan kunci di konferensi internasional.', 'alt' => 'Kancah Internasional'],
                    ['url' => '/images/news-peluncuran.jpg', 'caption' => 'Diskusi meja bundar bersama perwakilan delegasi berbagai negara peserta.', 'alt' => 'Diskusi Panel']
                ],
                'tags' => ['InspirasiAlumni', 'KancahInternasional', 'TeknologiGlobal', 'MayogaMendunia', 'KiprahAlumni'],
                'status' => NewsStatus::PUBLISHED,
                'published_at' => now()->subDays(18),
            ]
        );

        // News 4
        $news4 = News::updateOrCreate(
            ['slug' => 'peluncuran-platform-m3s-connect-resmi-dimulai'],
            [
                'category_id' => $subCatPortal->id,
                'author_id' => $admin->id,
                'title' => 'Peluncuran Platform M3S Connect Resmi Dimulai',
                'excerpt' => 'Portal terpadu alumni MAN 3 Sleman kini hadir untuk memfasilitasi pendataan digital, forum komunikasi, direktori karir, dan arsip kenangan madrasah.',
                'content' => "<p>Era digital menuntut kemudahan konektivitas yang cepat, aman, dan berkesinambungan. Menjawab kebutuhan tersebut, Ikatan Alumni MAN 3 Sleman secara resmi merilis platform digital M3S Connect.</p><p>Platform ini dirancang khusus dengan berbagai fitur unggulan, antara lain direktori pencarian alumni terverifikasi, forum diskusi tematik, ruang kabar berita madrasah, serta dokumentasi galeri kegiatan.</p><p>Seluruh alumni dihimbau untuk segera membuat akun, memutakhirkan riwayat karir dan domisili, agar jaringan silaturahmi semakin solid.</p>",
                'cover_image' => 'news/covers/news-peluncuran.jpg',
                'content_images' => [
                    ['url' => '/images/news-peluncuran.jpg', 'caption' => 'Peluncuran resmi platform digital M3S Connect dihadiri oleh perwakilan pengurus angkatan.', 'alt' => 'Peluncuran Platform'],
                    ['url' => '/images/doc-wisuda.jpg', 'caption' => 'Integrasi data kelulusan memudahkan alumni melakukan verifikasi akun mandiri.', 'alt' => 'Integrasi Data']
                ],
                'tags' => ['M3SConnect', 'TransformasiDigital', 'AlumniMayoga', 'DatabaseAlumni', 'InovasiMadrasah'],
                'status' => NewsStatus::PUBLISHED,
                'published_at' => now()->subDays(22),
            ]
        );

        // Comments for News 1
        NewsComment::updateOrCreate(
            ['news_id' => $news1->id, 'author_email' => 'budi.santoso@alumni.m3s.id'],
            [
                'user_id' => $alumni1->id,
                'author_name' => 'Budi Santoso',
                'content' => 'Alhamdulillah acara berjalan dengan sangat lancar dan penuh kenangan. Senang sekali bisa bertemu kembali dengan bapak ibu guru serta teman-teman seangkatan.',
                'is_approved' => true,
            ]
        );

        NewsComment::updateOrCreate(
            ['news_id' => $news1->id, 'author_email' => 'siti.nurhaliza@tokopedia.com'],
            [
                'user_id' => $alumni2->id,
                'author_name' => 'Siti Nurhaliza',
                'content' => 'Terima kasih untuk panitia yang sudah menyiapkan acara sebaik ini. Usul untuk reuni berikutnya diadakan sesi panel sharing karir teknologi secara khusus.',
                'is_approved' => true,
            ]
        );

        NewsComment::updateOrCreate(
            ['news_id' => $news1->id, 'author_email' => 'rina@karyarasa.id'],
            [
                'user_id' => null,
                'author_name' => 'Rina Oktaviani',
                'content' => 'Stand UMKM alumni juga ramai peminat. Bangga menjadi bagian dari keluarga besar MAN 3 Sleman!',
                'is_approved' => true,
            ]
        );

        // Pending comment for News 1 (for moderation queue)
        NewsComment::updateOrCreate(
            ['news_id' => $news1->id, 'author_email' => 'ahmad.fauzi@gmail.com'],
            [
                'user_id' => null,
                'author_name' => 'Ahmad Fauzi',
                'content' => 'Mohon info apakah ada rekaman video streaming acara reuni kemarin yang bisa diakses untuk alumni yang berhalangan hadir?',
                'is_approved' => false,
            ]
        );

        // Comments for News 2
        NewsComment::updateOrCreate(
            ['news_id' => $news2->id, 'author_email' => 'farhan@student.ugm.ac.id'],
            [
                'user_id' => null,
                'author_name' => 'Farhan Hakim',
                'content' => 'Terima kasih banyak atas program beasiswa ini. Sangat membantu adik-adik angkatan yang sedang menempuh semester akhir perkuliahan.',
                'is_approved' => true,
            ]
        );

        // Pending comment for News 2 (for moderation queue)
        NewsComment::updateOrCreate(
            ['news_id' => $news2->id, 'author_email' => 'dinda.lestari@ui.ac.id'],
            [
                'user_id' => null,
                'author_name' => 'Dinda Lestari',
                'content' => 'Apakah program beasiswa ini juga terbuka bagi mahasiswa yang baru menempuh semester awal perkuliahan?',
                'is_approved' => false,
            ]
        );

        // 7. Event Categories & Events
        $eventCat = EventCategory::firstOrCreate(
            ['slug' => 'temu-alumni'],
            ['name' => 'Temu Alumni', 'description' => 'Kegiatan silaturahmi luring maupun daring.']
        );

        Event::firstOrCreate(
            ['slug' => 'webinar-karir-alumni-membangun-portofolio-global'],
            [
                'category_id' => $eventCat->id,
                'created_by' => $moderator->id,
                'title' => 'Webinar Karir Alumni: Membangun Portofolio Global di Era Digital',
                'description' => 'Sesi sharing bersama para alumni praktisi industri teknologi dan bisnis internasional tentang strategi karir.',
                'location' => 'Online (Zoom Meeting)',
                'start_at' => now()->addDays(14)->setHour(19)->setMinute(0),
                'end_at' => now()->addDays(14)->setHour(21)->setMinute(0),
                'registration_start_at' => now()->subDay(),
                'registration_end_at' => now()->addDays(13),
                'max_participants' => 200,
                'status' => EventStatus::PUBLISHED,
            ]
        );

        // 8. Pending Alumni for Verification Testing
        $pendingAlumni = User::firstOrCreate(
            ['email' => 'rizky.ramadhan@alumni.m3s.id'],
            [
                'name' => 'Rizky Ramadhan, S.Kom.',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::PENDING,
            ]
        );

        AlumniProfile::firstOrCreate(
            ['user_id' => $pendingAlumni->id],
            [
                'graduation_year' => 2021,
                'graduation_class' => 'IPA 1',
                'occupation' => 'Frontend Engineer',
                'company' => 'PT Inovasi Digital Nusantara',
                'current_city' => 'Sleman',
                'current_country' => 'Indonesia',
                'visibility' => ProfileVisibility::PUBLIC,
            ]
        );

        // 9. Sample Spam Report for Moderation Testing
        $sampleThread = ForumThread::first();
        if ($sampleThread) {
            \App\Models\Report::firstOrCreate(
                [
                    'reportable_type' => ForumThread::class,
                    'reportable_id' => $sampleThread->id,
                ],
                [
                    'user_id' => $alumni1->id,
                    'reason' => 'spam',
                    'description' => 'Terdapat indikasi pesan promosi komersial tidak berizin pada topik ini.',
                    'status' => \App\Enums\ReportStatus::PENDING,
                ]
            );
        }
    }
}
