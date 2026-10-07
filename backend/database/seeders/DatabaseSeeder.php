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

        // 4. Forum Categories
        $catUmum = ForumCategory::firstOrCreate(
            ['slug' => 'diskusi-umum'],
            [
                'name' => 'Diskusi Umum',
                'description' => 'Ruang santai bertukar kabar, kenangan masa sekolah, dan obrolan bebas antar alumni.',
                'icon' => 'chat-bubble-left-right',
                'image' => '/images/hero-man3-sleman.jpg',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        $catKarir = ForumCategory::firstOrCreate(
            ['slug' => 'karir-dan-profesi'],
            [
                'name' => 'Karir & Profesi',
                'description' => 'Informasi lowongan pekerjaan, magang, bimbingan karir, dan networking profesional.',
                'icon' => 'briefcase',
                'image' => '/images/news-internasional.jpg',
                'sort_order' => 2,
                'is_active' => true,
            ]
        );

        $catReuni = ForumCategory::firstOrCreate(
            ['slug' => 'kegiatan-dan-reuni'],
            [
                'name' => 'Kegiatan & Reuni',
                'description' => 'Agenda temu kangen, bakti sosial, dan kepanitiaan alumni.',
                'icon' => 'calendar',
                'image' => '/images/news-reuni.jpg',
                'sort_order' => 3,
                'is_active' => true,
            ]
        );

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

        $news1 = News::firstOrCreate(
            ['slug' => 'reuni-akbar-alumni-man-3-sleman-2025'],
            [
                'category_id' => $subCatReuni->id,
                'author_id' => $admin->id,
                'title' => 'Reuni Akbar Alumni MAN 3 Sleman 2025 Berlangsung Meriah',
                'excerpt' => 'Ribuan alumni dari berbagai angkatan hadir dalam acara Reuni Akbar yang digelar di halaman MAN 3 Sleman, mempererat silaturahmi dan merajut kolaborasi masa depan.',
                'content' => 'Suasana penuh kehangatan dan rasa haru mewarnai halaman kampus MAN 3 Sleman pada hari Minggu, 12 Mei 2025. Lebih dari 1.500 alumni dari angkatan 1990 hingga lulusan terbaru 2024 berkumpul kembali dalam gelaran akbar Reuni Akbar Alumni MAN 3 Sleman bertajuk Satu Alumni, Seribu Cerita, Satu Tujuan.',
                'cover_image' => '/images/news-reuni.jpg',
                'content_images' => [
                    ['url' => '/images/news-reuni.jpg', 'caption' => 'Suasana pembukaan Reuni Akbar di lapangan utama', 'alt' => 'Reuni Akbar'],
                    ['url' => '/images/doc-baksos.jpg', 'caption' => 'Penyerahan cenderamata bakti sosial kepada madrasah', 'alt' => 'Bakti Sosial']
                ],
                'tags' => ['ReuniAkbar2025', 'AlumniMayoga', 'MAN3Sleman', 'SilaturahmiAlumni'],
                'status' => NewsStatus::PUBLISHED,
                'published_at' => now()->subDays(10),
            ]
        );

        \App\Models\NewsComment::firstOrCreate(
            ['news_id' => $news1->id, 'author_email' => 'budi.santoso@alumni.m3s.id'],
            [
                'user_id' => $alumni1->id,
                'author_name' => 'Budi Santoso',
                'content' => 'Alhamdulillah acara berjalan dengan sangat lancar dan penuh kenangan. Senang sekali bisa bertemu kembali dengan bapak ibu guru serta rekan seangkatan.',
                'is_approved' => true,
            ]
        );

        \App\Models\NewsComment::firstOrCreate(
            ['news_id' => $news1->id, 'author_email' => 'siti.rahmawati@alumni.m3s.id'],
            [
                'user_id' => $alumni2->id,
                'author_name' => 'Siti Rahmawati',
                'content' => 'Terima kasih panitia atas kerja kerasnya! Ditunggu agenda workshop karir berikutnya.',
                'is_approved' => true,
            ]
        );

        News::firstOrCreate(
            ['slug' => 'program-beasiswa-untuk-alumni-berprestasi'],
            [
                'category_id' => $subCatStudi->id,
                'author_id' => $moderator->id,
                'title' => 'Program Beasiswa untuk Alumni Berprestasi',
                'excerpt' => 'Ikatan Alumni MAN 3 Sleman resmi meluncurkan program beasiswa jenjang pendidikan tinggi bagi alumni dan siswa berprestasi yang membutuhkan dukungan operasional studi.',
                'content' => 'Sebagai wujud kepedulian antargenerasi, Ikatan Alumni MAN 3 Sleman membuka pendaftaran Beasiswa Alumni Berprestasi tahun akademik berjalan.',
                'cover_image' => '/images/news-beasiswa.jpg',
                'content_images' => [
                    ['url' => '/images/news-beasiswa.jpg', 'caption' => 'Penyerahan beasiswa sarjana', 'alt' => 'Beasiswa'],
                ],
                'tags' => ['BeasiswaAlumni', 'PrestasiMayoga', 'MayogaPeduli'],
                'status' => NewsStatus::PUBLISHED,
                'published_at' => now()->subDays(14),
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
