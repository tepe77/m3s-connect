<?php

namespace Database\Seeders;

use App\Enums\EventStatus;
use App\Enums\ForumPostStatus;
use App\Enums\ForumThreadStatus;
use App\Enums\NewsStatus;
use App\Enums\ProfileVisibility;
use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\AlumniEducation;
use App\Models\AlumniExperience;
use App\Models\AlumniProfile;
use App\Models\AlumniSocialLink;
use App\Models\Documentation;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\ForumCategory;
use App\Models\ForumPost;
use App\Models\ForumThread;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\NewsComment;
use App\Models\Report;
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
        // ---------------------------------------------------------------------
        // 1. Roles & Initial Core Users
        // ---------------------------------------------------------------------
        $admin = User::firstOrCreate(
            ['email' => 'admin@m3s-connect.id'],
            [
                'name' => 'Administrator M3S',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ADMIN,
                'status' => UserStatus::ACTIVE,
                'avatar' => '/images/hero-man3-sleman.jpg',
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
                'avatar' => '/images/avatar-ahmad.jpg',
                'email_verified_at' => now(),
            ]
        );

        // ---------------------------------------------------------------------
        // 2. 6 Verified Alumni Profiles (100% Synced with frontend alumniData.ts)
        // ---------------------------------------------------------------------

        // Alumni 1: Siti Nurhaliza, S.T.
        $alumni1 = User::updateOrCreate(
            ['email' => 'siti.nurhaliza@alumni.m3s.id'],
            [
                'name' => 'Siti Nurhaliza, S.T.',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::ACTIVE,
                'avatar' => '/images/avatar-siti.jpg',
                'email_verified_at' => now(),
            ]
        );

        $profile1 = AlumniProfile::updateOrCreate(
            ['user_id' => $alumni1->id],
            [
                'graduation_year' => 2012,
                'graduation_class' => 'IPA 1',
                'alumni_identifier' => 'M3S-2012-0081',
                'gender' => 'female',
                'birth_date' => '1994-04-12',
                'bio' => 'Pengembang aplikasi web dan antarmuka berkinerja tinggi. Senang berbagi ilmu seputar teknologi dan aktif membimbing adik-adik angkatan dalam persiapan karir rekayasa perangkat lunak.',
                'current_city' => 'Jakarta Selatan',
                'current_country' => 'Indonesia',
                'occupation' => 'Software Engineer',
                'company' => 'Tokopedia',
                'visibility' => ProfileVisibility::PUBLIC,
                'verified_at' => now(),
            ]
        );

        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile1->id, 'institution' => 'Institut Teknologi Bandung'],
            [
                'degree' => 'S1',
                'field_of_study' => 'Teknik Informatika',
                'start_year' => 2012,
                'end_year' => 2016,
                'description' => 'Lulus dengan predikat sangat memuaskan, fokus riset sistem web terdistribusi.',
            ]
        );
        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile1->id, 'institution' => 'MAN 3 Sleman (Mayoga)'],
            [
                'degree' => 'Madrasah Aliyah',
                'field_of_study' => 'Jurusan IPA',
                'start_year' => 2009,
                'end_year' => 2012,
                'description' => 'Aktif dalam kelompok ilmiah remaja dan olimpiade komputer.',
            ]
        );

        AlumniExperience::firstOrCreate(
            ['alumni_profile_id' => $profile1->id, 'company' => 'Tokopedia'],
            [
                'position' => 'Software Engineer',
                'location' => 'Jakarta Selatan',
                'start_date' => '2019-01-01',
                'end_date' => null,
                'is_current' => true,
                'description' => 'Mengembangkan platform frontend berskala jutaan pengguna harian.',
            ]
        );
        AlumniExperience::firstOrCreate(
            ['alumni_profile_id' => $profile1->id, 'company' => 'Digital Studio Asia'],
            [
                'position' => 'Junior Frontend Developer',
                'location' => 'Bandung',
                'start_date' => '2016-07-01',
                'end_date' => '2019-01-01',
                'is_current' => false,
                'description' => 'Membangun portal aplikasi web interaktif untuk berbagai klien institusi.',
            ]
        );

        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile1->id, 'platform' => 'linkedin'], ['url' => 'https://linkedin.com/in/sitinurhaliza']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile1->id, 'platform' => 'github'], ['url' => 'https://github.com/sitinurhaliza']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile1->id, 'platform' => 'instagram'], ['url' => 'https://instagram.com/sitinurhaliza']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile1->id, 'platform' => 'website'], ['url' => 'https://sitinurhaliza.dev']);

        // Alumni 2: Ahmad Fauzi, M.Pd.
        $alumni2 = User::updateOrCreate(
            ['email' => 'ahmad.fauzi@alumni.m3s.id'],
            [
                'name' => 'Ahmad Fauzi, M.Pd.',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::ACTIVE,
                'avatar' => '/images/avatar-ahmad.jpg',
                'email_verified_at' => now(),
            ]
        );

        $profile2 = AlumniProfile::updateOrCreate(
            ['user_id' => $alumni2->id],
            [
                'graduation_year' => 2010,
                'graduation_class' => 'IPA 2',
                'alumni_identifier' => 'M3S-2010-0034',
                'gender' => 'male',
                'birth_date' => '1992-08-17',
                'bio' => 'Dosen bidang kurikulum pendidikan sains dan teknologi madrasah. Aktif dalam kepanitiaan ikatan alumni, riset edukasi nasional, dan pengabdian masyarakat.',
                'current_city' => 'Yogyakarta',
                'current_country' => 'Indonesia',
                'occupation' => 'Dosen & Peneliti',
                'company' => 'UIN Sunan Kalijaga',
                'visibility' => ProfileVisibility::PUBLIC,
                'verified_at' => now(),
            ]
        );

        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile2->id, 'institution' => 'Universitas Negeri Yogyakarta'],
            [
                'degree' => 'S2',
                'field_of_study' => 'Magister Pendidikan Sains',
                'start_year' => 2014,
                'end_year' => 2017,
                'description' => 'Tesis tentang integrasi teknologi digital pada pembelajaran sains madrasah.',
            ]
        );
        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile2->id, 'institution' => 'UIN Sunan Kalijaga Yogyakarta'],
            [
                'degree' => 'S1',
                'field_of_study' => 'Pendidikan Fisika',
                'start_year' => 2010,
                'end_year' => 2014,
                'description' => 'Lulusan terbaik fakultas tarbiyah angkatan 2010.',
            ]
        );
        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile2->id, 'institution' => 'MAN 3 Sleman (Mayoga)'],
            [
                'degree' => 'Madrasah Aliyah',
                'field_of_study' => 'Jurusan IPA',
                'start_year' => 2007,
                'end_year' => 2010,
                'description' => 'Ketua OSIS periode 2008/2009.',
            ]
        );

        AlumniExperience::firstOrCreate(
            ['alumni_profile_id' => $profile2->id, 'company' => 'UIN Sunan Kalijaga'],
            [
                'position' => 'Dosen Tetap Fakultas Tarbiyah',
                'location' => 'Yogyakarta',
                'start_date' => '2018-01-01',
                'end_date' => null,
                'is_current' => true,
                'description' => 'Mengampu mata kuliah kurikulum, evaluasi pembelajaran, dan media edukasi digital.',
            ]
        );
        AlumniExperience::firstOrCreate(
            ['alumni_profile_id' => $profile2->id, 'company' => 'Ikatan Alumni MAN 3 Sleman'],
            [
                'position' => 'Ketua Panitia Reuni Akbar 2025',
                'location' => 'Sleman',
                'start_date' => '2024-01-01',
                'end_date' => '2025-05-31',
                'is_current' => false,
                'description' => 'Mengoordinasikan perhelatan akbar reuni lintas angkatan 1990 hingga 2024.',
            ]
        );

        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile2->id, 'platform' => 'linkedin'], ['url' => 'https://linkedin.com/in/ahmadfauzi']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile2->id, 'platform' => 'twitter'], ['url' => 'https://x.com/ahmadfauzi']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile2->id, 'platform' => 'website'], ['url' => 'https://ahmadfauzi.id']);

        // Alumni 3: Rina Oktaviani, S.E.
        $alumni3 = User::updateOrCreate(
            ['email' => 'rina.oktaviani@alumni.m3s.id'],
            [
                'name' => 'Rina Oktaviani, S.E.',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::ACTIVE,
                'avatar' => '/images/avatar-rina.jpg',
                'email_verified_at' => now(),
            ]
        );

        $profile3 = AlumniProfile::updateOrCreate(
            ['user_id' => $alumni3->id],
            [
                'graduation_year' => 2015,
                'graduation_class' => 'IPS 1',
                'alumni_identifier' => 'M3S-2015-0112',
                'gender' => 'female',
                'birth_date' => '1997-10-05',
                'bio' => 'Membangun ekosistem UMKM kuliner nusantara berbasis bahan pangan lokal berkualitas. Terbuka lebar untuk kolaborasi wirausaha bersama keluarga besar alumni MAN 3 Sleman.',
                'current_city' => 'Yogyakarta',
                'current_country' => 'Indonesia',
                'occupation' => 'Entrepreneur (Founder)',
                'company' => 'KaryaRasa Culinary',
                'visibility' => ProfileVisibility::PUBLIC,
                'verified_at' => now(),
            ]
        );

        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile3->id, 'institution' => 'Universitas Gadjah Mada'],
            [
                'degree' => 'S1',
                'field_of_study' => 'Ilmu Ekonomi & Manajemen Bisnis',
                'start_year' => 2015,
                'end_year' => 2019,
                'description' => 'Fokus riset kewirausahaan kreatif dan strategi pemasaran digital produk lokal.',
            ]
        );
        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile3->id, 'institution' => 'MAN 3 Sleman (Mayoga)'],
            [
                'degree' => 'Madrasah Aliyah',
                'field_of_study' => 'Jurusan IPS',
                'start_year' => 2012,
                'end_year' => 2015,
                'description' => 'Juara kompetisi bisnis rencana wirausaha tingkat pelajar DIY.',
            ]
        );

        AlumniExperience::firstOrCreate(
            ['alumni_profile_id' => $profile3->id, 'company' => 'KaryaRasa Culinary'],
            [
                'position' => 'Founder & CEO',
                'location' => 'Yogyakarta',
                'start_date' => '2020-03-01',
                'end_date' => null,
                'is_current' => true,
                'description' => 'Memimpin rantai gerai kuliner dan kemitraan suplai bahan baku petani lokal.',
            ]
        );

        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile3->id, 'platform' => 'linkedin'], ['url' => 'https://linkedin.com/in/rinaoktaviani']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile3->id, 'platform' => 'instagram'], ['url' => 'https://instagram.com/karyarasa.id']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile3->id, 'platform' => 'website'], ['url' => 'https://karyarasa.id']);

        // Alumni 4: Budi Santoso, S.Kom.
        $alumni4 = User::updateOrCreate(
            ['email' => 'budi.santoso@alumni.m3s.id'],
            [
                'name' => 'Budi Santoso, S.Kom.',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::ACTIVE,
                'avatar' => '/images/avatar-ahmad.jpg',
                'email_verified_at' => now(),
            ]
        );

        $profile4 = AlumniProfile::updateOrCreate(
            ['user_id' => $alumni4->id],
            [
                'graduation_year' => 2018,
                'graduation_class' => 'IPA 2',
                'alumni_identifier' => 'M3S-2018-0042',
                'gender' => 'male',
                'birth_date' => '2000-05-14',
                'bio' => 'Fokus pada arsitektur mikroservis terdistribusi, basis data PostgreSQL, dan sistem perpesanan berkecepatan tinggi. Senang berkontribusi pada pengembangan sistem teknologi madrasah.',
                'current_city' => 'Yogyakarta',
                'current_country' => 'Indonesia',
                'occupation' => 'Senior Backend Engineer',
                'company' => 'Tech Nusantara',
                'visibility' => ProfileVisibility::PUBLIC,
                'verified_at' => now(),
            ]
        );

        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile4->id, 'institution' => 'Universitas Gadjah Mada'],
            [
                'degree' => 'S1',
                'field_of_study' => 'Teknologi Informasi',
                'start_year' => 2018,
                'end_year' => 2022,
                'description' => 'Lulus Cumlaude dengan fokus riset arsitektur cloud terdesentralisasi.',
            ]
        );
        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile4->id, 'institution' => 'MAN 3 Sleman (Mayoga)'],
            [
                'degree' => 'Madrasah Aliyah',
                'field_of_study' => 'Jurusan IPA',
                'start_year' => 2015,
                'end_year' => 2018,
                'description' => 'Aktif di ekstrakurikuler robotika dan teknologi informasi.',
            ]
        );

        AlumniExperience::firstOrCreate(
            ['alumni_profile_id' => $profile4->id, 'company' => 'Tech Nusantara'],
            [
                'position' => 'Senior Backend Engineer',
                'location' => 'Yogyakarta',
                'start_date' => '2022-07-01',
                'end_date' => null,
                'is_current' => true,
                'description' => 'Mengembangkan backend API mikroservis dan integrasi payment gateway terpadu.',
            ]
        );

        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile4->id, 'platform' => 'linkedin'], ['url' => 'https://linkedin.com/in/budisantoso']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile4->id, 'platform' => 'github'], ['url' => 'https://github.com/budisantoso']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile4->id, 'platform' => 'twitter'], ['url' => 'https://x.com/budisantoso']);

        // Alumni 5: Dewi Lestari, S.Psi.
        $alumni5 = User::updateOrCreate(
            ['email' => 'dewi.lestari@alumni.m3s.id'],
            [
                'name' => 'Dewi Lestari, S.Psi.',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::ACTIVE,
                'avatar' => '/images/avatar-rina.jpg',
                'email_verified_at' => now(),
            ]
        );

        $profile5 = AlumniProfile::updateOrCreate(
            ['user_id' => $alumni5->id],
            [
                'graduation_year' => 2016,
                'graduation_class' => 'IPS 2',
                'alumni_identifier' => 'M3S-2016-0067',
                'gender' => 'female',
                'birth_date' => '1998-03-22',
                'bio' => 'Praktisi psikologi organisasi dan pengembangan potensi SDM muda. Menyediakan bimbingan persiapan karir dan wawancara bagi lulusan baru madrasah.',
                'current_city' => 'Jakarta Pusat',
                'current_country' => 'Indonesia',
                'occupation' => 'People & Culture Lead',
                'company' => 'Inovasi Talenta Asia',
                'visibility' => ProfileVisibility::PUBLIC,
                'verified_at' => now(),
            ]
        );

        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile5->id, 'institution' => 'Universitas Indonesia'],
            [
                'degree' => 'S1',
                'field_of_study' => 'Psikologi Industri & Organisasi',
                'start_year' => 2016,
                'end_year' => 2020,
                'description' => 'Fokus pada pengembangan kompetensi kerja generasi Z di industri teknologi.',
            ]
        );

        AlumniExperience::firstOrCreate(
            ['alumni_profile_id' => $profile5->id, 'company' => 'Inovasi Talenta Asia'],
            [
                'position' => 'People & Culture Lead',
                'location' => 'Jakarta Pusat',
                'start_date' => '2021-02-01',
                'end_date' => null,
                'is_current' => true,
                'description' => 'Mengelola strategi talenta, retensi karyawan, dan program pelatihan kepemimpinan.',
            ]
        );

        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile5->id, 'platform' => 'linkedin'], ['url' => 'https://linkedin.com/in/dewilestari']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile5->id, 'platform' => 'instagram'], ['url' => 'https://instagram.com/dewilestari']);

        // Alumni 6: dr. Farhan Hakim
        $alumni6 = User::updateOrCreate(
            ['email' => 'farhan.hakim@alumni.m3s.id'],
            [
                'name' => 'dr. Farhan Hakim',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::ACTIVE,
                'avatar' => '/images/avatar-siti.jpg',
                'email_verified_at' => now(),
            ]
        );

        $profile6 = AlumniProfile::updateOrCreate(
            ['user_id' => $alumni6->id],
            [
                'graduation_year' => 2014,
                'graduation_class' => 'IPA 1',
                'alumni_identifier' => 'M3S-2014-0019',
                'gender' => 'male',
                'birth_date' => '1996-11-30',
                'bio' => 'Menjalani pendidikan spesialis kesehatan anak. Aktif sebagai koordinator tim kesehatan pada setiap gelaran bakti sosial alumni Mayoga.',
                'current_city' => 'Sleman',
                'current_country' => 'Indonesia',
                'occupation' => 'Dokter Residen Pediatri',
                'company' => 'RSUP Dr. Sardjito',
                'visibility' => ProfileVisibility::PUBLIC,
                'verified_at' => now(),
            ]
        );

        AlumniEducation::firstOrCreate(
            ['alumni_profile_id' => $profile6->id, 'institution' => 'Fakultas Kedokteran UGM'],
            [
                'degree' => 'Profesi Dokter',
                'field_of_study' => 'Pendidikan Dokter & Spesialis Pediatri',
                'start_year' => 2014,
                'end_year' => 2020,
                'description' => 'Lulus dengan predikat dokter teladan pelayanan primer.',
            ]
        );

        AlumniExperience::firstOrCreate(
            ['alumni_profile_id' => $profile6->id, 'company' => 'RSUP Dr. Sardjito'],
            [
                'position' => 'Dokter Residen Anak',
                'location' => 'Yogyakarta',
                'start_date' => '2021-06-01',
                'end_date' => null,
                'is_current' => true,
                'description' => 'Melayani perawatan anak rawat inap, intensif, dan posyandu kemanusiaan.',
            ]
        );

        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile6->id, 'platform' => 'linkedin'], ['url' => 'https://linkedin.com/in/farhanhakim']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile6->id, 'platform' => 'instagram'], ['url' => 'https://instagram.com/dr.farhanhakim']);
        AlumniSocialLink::firstOrCreate(['alumni_profile_id' => $profile6->id, 'platform' => 'twitter'], ['url' => 'https://x.com/farhanhakim']);

        // ---------------------------------------------------------------------
        // 3. Skills Mapping
        // ---------------------------------------------------------------------
        $allSkills = [
            'React', 'Next.js', 'TypeScript', 'Web Performance', 'UI Architecture',
            'Kurikulum Madrasah', 'Metodologi Riset', 'Pendidikan Sains', 'Public Speaking', 'Pengabdian Masyarakat',
            'Business Development', 'F&B Management', 'Digital Marketing', 'Brand Strategy', 'UMKM Mentoring',
            'Laravel', 'PostgreSQL', 'Redis', 'Docker', 'Go',
            'Talent Acquisition', 'Career Coaching', 'Organizational Behavior', 'HR Strategy',
            'Kedokteran Anak', 'Layanan Kesehatan Komunitas', 'Konsultasi Medis', 'Relawan Kemanusiaan'
        ];

        $skillModels = [];
        foreach ($allSkills as $skillName) {
            $skillModels[$skillName] = Skill::firstOrCreate(
                ['name' => $skillName],
                ['slug' => Str::slug($skillName)]
            );
        }

        $syncSkills = function (AlumniProfile $profile, array $names) use ($skillModels) {
            $ids = array_map(fn ($n) => $skillModels[$n]->id, $names);
            $profile->skills()->sync($ids);
        };

        $syncSkills($profile1, ['React', 'Next.js', 'TypeScript', 'Web Performance', 'UI Architecture']);
        $syncSkills($profile2, ['Kurikulum Madrasah', 'Metodologi Riset', 'Pendidikan Sains', 'Public Speaking', 'Pengabdian Masyarakat']);
        $syncSkills($profile3, ['Business Development', 'F&B Management', 'Digital Marketing', 'Brand Strategy', 'UMKM Mentoring']);
        $syncSkills($profile4, ['Laravel', 'PostgreSQL', 'Redis', 'Docker', 'Go', 'Next.js']);
        $syncSkills($profile5, ['Talent Acquisition', 'Career Coaching', 'Organizational Behavior', 'HR Strategy']);
        $syncSkills($profile6, ['Kedokteran Anak', 'Layanan Kesehatan Komunitas', 'Konsultasi Medis', 'Relawan Kemanusiaan']);

        // ---------------------------------------------------------------------
        // 4. Forum Categories (Synchronized with frontend portal)
        // ---------------------------------------------------------------------
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

        $catMap = [];
        foreach ($forumCategories as $categoryData) {
            $catMap[$categoryData['slug']] = ForumCategory::updateOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );
        }

        // ---------------------------------------------------------------------
        // 5. 6 Forum Threads & Nested Posts (100% Synced with forumData.ts)
        // ---------------------------------------------------------------------

        // Thread 1: Reuni Akbar Lintas Angkatan 2026
        $thread1 = ForumThread::updateOrCreate(
            ['slug' => 'rencana-reuni-akbar-lintas-angkatan-2026'],
            [
                'category_id' => $catMap['kegiatan-dan-reuni']->id,
                'user_id' => $alumni4->id,
                'title' => 'Rencana Reuni Akbar Lintas Angkatan MAN 3 Sleman 2026: Pembentukan Panitia & Usulan Lokasi',
                'body' => "Assalamu'alaikum Warahmatullahi Wabarakatuh rekan-rekan keluarga besar alumni MAN 3 Sleman (Mayoga).\n\nMenyambut tahun 2026, ikatan alumni merencanakan perhelatan Reuni Akbar Lintas Angkatan (1990 - 2025) sebagai momentum mempererat tali ukhuwah dan meresmikan program beasiswa abadi alumni.\n\nMelalui topik ini, kami membuka ruang diskusi terbuka untuk beberapa hal penting:\n1. Struktur Koordinator Angkatan: Perwakilan 1 - 2 narahubung per angkatan.\n2. Usulan Venue Kegiatan: Apakah lebih representatif diadakan di halaman utama kampus Mayoga atau sewa convention center di Yogyakarta?\n3. Format Agenda: Sesi sarasehan inspiratif karir, panggung seni tradisi siswa-alumni, dan bazar UMKM alumni.\n\nSilakan sampaikan pandangan, ide, dan kesediaan rekan-rekan untuk bergabung dalam kepanitiaan kerja. Terima kasih banyak atas dedikasinya!",
                'status' => ForumThreadStatus::PUBLISHED,
                'is_pinned' => true,
                'is_locked' => false,
                'views_count' => 1420,
                'last_post_at' => now()->subHours(5),
            ]
        );

        $post101 = ForumPost::updateOrCreate(
            ['thread_id' => $thread1->id, 'user_id' => $alumni1->id, 'parent_id' => null],
            [
                'body' => "Wa'alaikumsalam wr wb Mas Budi. Usulan yang sangat dinantikan! Menurut pandangan saya, mengadakan sesi utama di kampus Mayoga memiliki nilai historis dan nostalgia yang sangat mendalam bagi para alumni sepuh maupun muda. Angkatan 2012 siap menjadi bagian dari tim pendaftaran dan sistem registrasi online.",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        ForumPost::updateOrCreate(
            ['thread_id' => $thread1->id, 'user_id' => $alumni2->id, 'parent_id' => $post101->id],
            [
                'body' => "Sepakat dengan Mbak Siti. Kampus Mayoga suasananya sekarang semakin asri setelah renovasi aula baru. Kami di angkatan 2010 siap mengoordinasikan penggalangan dana program Beasiswa Abadi untuk adik-adik siswa berprestasi yang kurang mampu.",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        ForumPost::updateOrCreate(
            ['thread_id' => $thread1->id, 'user_id' => $alumni3->id, 'parent_id' => null],
            [
                'body' => "Dari klaster wirausaha kuliner alumni, kami siap mendirikan 20 stan makanan nusantara dan kopi lokal untuk menjamu para tamu dan alumni. Mohon info jika jadwal technical meeting panitia sudah diagendakan.",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        ForumPost::updateOrCreate(
            ['thread_id' => $thread1->id, 'user_id' => $alumni4->id, 'parent_id' => null],
            [
                'body' => "Alhamdulillah sambutan dari rekan-rekan luar biasa positif! InsyaAllah rapat koordinasi perdana via Google Meet akan dijadwalkan hari Sabtu malam pekan ini. Tautan undangan akan dibagikan di thread ini.",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        // Clean up legacy slug if present
        ForumThread::where('slug', 'reuni-akbar-lintas-angkatan-2026')->delete();

        // Thread 2: Lowongan Kerja di Tech Nusantara
        $thread2 = ForumThread::updateOrCreate(
            ['slug' => 'lowongan-backend-engineer-product-specialist-tech-nusantara'],
            [
                'category_id' => $catMap['karir-dan-profesi']->id,
                'user_id' => $alumni4->id,
                'title' => 'Lowongan Kerja: Backend Engineer & Product Specialist di Tech Nusantara (Terbuka untuk Alumni)',
                'body' => "Halo rekan-rekan alumni Mayoga,\n\nKantor kami di Tech Nusantara (Yogyakarta & Jakarta hybrid) saat ini sedang membuka kesempatan berkarir untuk dua posisi:\n- Mid/Senior Backend Engineer (Laravel / Go)\n- Product Operations Specialist (Fresh Graduate / 1-2 tahun pengalaman)\n\nKriteria utama:\n- Memahami konsep clean code, RESTful API, dan basis data relasional.\n- Mau belajar dan memiliki integritas tinggi.\n- Bagi alumni MAN 3 Sleman, tersedia jalur referral langsung dan bimbingan teknis persiapan interview.\n\nBagi yang berminat, silakan kirimkan CV atau portofolio ke alamat email karir resmi atau mention saya di forum ini.",
                'status' => ForumThreadStatus::PUBLISHED,
                'is_pinned' => false,
                'is_locked' => false,
                'views_count' => 960,
                'last_post_at' => now()->subHours(8),
            ]
        );

        $post201 = ForumPost::updateOrCreate(
            ['thread_id' => $thread2->id, 'user_id' => $alumni6->id, 'parent_id' => null],
            [
                'body' => "Terima kasih infonya Mas Budi! Untuk posisi Backend, apakah mahasiswa semester akhir yang sedang menyusun skripsi diperkenankan melamar secara remote?",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        ForumPost::updateOrCreate(
            ['thread_id' => $thread2->id, 'user_id' => $alumni4->id, 'parent_id' => $post201->id],
            [
                'body' => "Bisa banget, silakan sertakan keterangan status semester akhir dan tautan repositori GitHub portofolio saat mengirimkan email ya.",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        ForumPost::updateOrCreate(
            ['thread_id' => $thread2->id, 'user_id' => $alumni1->id, 'parent_id' => null],
            [
                'body' => "Rekomendasi luar biasa untuk adik-adik alumni yang ingin belajar arsitektur produksi modern. Sukses selalu tim Tech Nusantara!",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        // Thread 3: Tips Beasiswa LPDP / AAS
        $thread3 = ForumThread::updateOrCreate(
            ['slug' => 'panduan-tips-lolos-beasiswa-lpdp-aas-alumni-mayoga'],
            [
                'category_id' => $catMap['beasiswa-dan-pendidikan']->id,
                'user_id' => $alumni2->id,
                'title' => 'Panduan & Tips Lolos Beasiswa LPDP / AAS untuk Alumni Mayoga: Dari Esai hingga Wawancara',
                'body' => "Banyak rekan alumni menanyakan bagaimana menyusun rencana studi dan esai kontribusi yang kuat untuk seleksi beasiswa pascasarjana.\n\nBerikut beberapa poin krusial yang perlu diperhatikan:\n1. Linearitas & Urgensi Riset: Pastikan masalah yang ingin diselesaikan terhubung erat dengan latar belakang profesional Anda.\n2. Kontribusi Nyata: Hindari narasi normatif; jelaskan langkah konkret pasca-studi di Indonesia.\n3. Persiapan Bahasa: Jangan tunda tes IELTS/TOEFL hingga mepet deadline.\n\nKami bersama tim alumni awardee LPDP bersedia mengadakan sesi bedah esai (mock review) secara cuma-cuma untuk adik-adik alumni yang sedang menyiapkan berkas tahun ini.",
                'status' => ForumThreadStatus::PUBLISHED,
                'is_pinned' => false,
                'is_locked' => false,
                'views_count' => 880,
                'last_post_at' => now()->subDay(),
            ]
        );

        $post301 = ForumPost::updateOrCreate(
            ['thread_id' => $thread3->id, 'user_id' => $alumni3->id, 'parent_id' => null],
            [
                'body' => "Program bedah esai ini sangat bermanfaat Pak Dosen Ahmad. Waktu saya mendaftar hibah bisnis, bimbingan narasi dari senior sangat menentukan kelolosan proposal.",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        ForumPost::updateOrCreate(
            ['thread_id' => $thread3->id, 'user_id' => $alumni2->id, 'parent_id' => $post301->id],
            [
                'body' => "Betul sekali Mbak Rina. Silakan bagi yang berminat mengunggah draft esai di sub-forum pendidikan ini untuk kami berikan masukan konstruktif.",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        // Thread 4: Pedoman Etika Komunitas
        $thread4 = ForumThread::updateOrCreate(
            ['slug' => 'pedoman-etika-tata-tertib-berdiskusi-forum-m3s-connect'],
            [
                'category_id' => $catMap['diskusi-umum']->id,
                'user_id' => $admin->id,
                'title' => 'Pedoman Etika & Tata Tertib Berdiskusi di Forum Komunitas Resmi M3S Connect',
                'body' => "Selamat datang di Forum Komunitas Resmi MAN 3 Sleman (M3S Connect).\n\nUntuk menjaga ruang diskusi yang santun, produktif, dan menjunjung nilai kekeluargaan madrasah, berikut beberapa pedoman umum:\n- Saling Menghargai: Hargai perbedaan pendapat dan dilarang menyebarkan ujaran kebencian, fitnah, maupun isu SARA.\n- Topik Relevan: Tempatkan postingan sesuai kategori yang tepat (Karir, Reuni, Bisnis, atau Pendidikan).\n- Hindari Spam & Promosi Ilegal: Promosi usaha diizinkan pada kategori Bisnis & UMKM dengan etika yang baik.\n- Laporkan Pelanggaran: Gunakan tombol laporkan jika menemukan konten yang melanggar norma komunitas.\n\nTerima kasih atas peran aktif rekan-rekan semua dalam mewujudkan forum yang bermanfaat.",
                'status' => ForumThreadStatus::PUBLISHED,
                'is_pinned' => true,
                'is_locked' => true,
                'views_count' => 2150,
                'last_post_at' => now()->subDays(9),
            ]
        );

        // Thread 5: Etalase Produk Alumni
        $thread5 = ForumThread::updateOrCreate(
            ['slug' => 'etalase-produk-alumni-pendataan-umkm-suplier-diy-jateng'],
            [
                'category_id' => $catMap['bisnis-dan-umkm']->id,
                'user_id' => $alumni3->id,
                'title' => 'Etalase Produk Alumni: Pendataan UMKM & Suplier Bahan Baku di Wilayah DIY - Jateng',
                'body' => "Mari saling dukung usaha sesama alumni Mayoga!\n\nBagi rekan-rekan yang memiliki usaha kuliner, kerajinan tangan, konveksi seragam, jasa konsultasi, atau produk pertanian lokal:\nSilakan balas thread ini dengan format:\n- Nama Usaha & Bidang:\n- Lokasi & Kontak / Akun Media Sosial:\n- Peluang Kerjasama / Kebutuhan Suplai:\n\nNantinya data ini akan kami rekap ke dalam direktori bisnis alumni agar lebih mudah saling berbelanja dan menjalin kemitraan.",
                'status' => ForumThreadStatus::PUBLISHED,
                'is_pinned' => false,
                'is_locked' => false,
                'views_count' => 620,
                'last_post_at' => now()->subHours(6),
            ]
        );

        $post501 = ForumPost::updateOrCreate(
            ['thread_id' => $thread5->id, 'user_id' => $alumni1->id, 'parent_id' => null],
            [
                'body' => "Saya bantu promosikan usaha keluarga: 'Batik Tulis Mayoga Klasik' spesialis seragam batik madrasah dan kemeja sutra halus di Sleman. Senang sekali bisa saling support sesama alumni!",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        ForumPost::updateOrCreate(
            ['thread_id' => $thread5->id, 'user_id' => $alumni3->id, 'parent_id' => $post501->id],
            [
                'body' => "Keren sekali Mbak Siti! Cocok banget untuk seragam panitia Reuni Akbar nanti. Sudah saya catat kontaknya.",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        // Thread 6: Pengembangan Sistem Arsip Digital
        $thread6 = ForumThread::updateOrCreate(
            ['slug' => 'pengembangan-sistem-arsip-digital-perpustakaan-mayoga'],
            [
                'category_id' => $catMap['teknologi-dan-inovasi']->id,
                'user_id' => $alumni4->id,
                'title' => 'Pengembangan Sistem Arsip Digital & Perpustakaan Mayoga: Panggilan Relawan Developer',
                'body' => "Pihak madrasah berencana mendigitalkan ribuan koleksi buku langka dan arsip sejarah angkatan Mayoga sejak awal berdirinya.\n\nKami berinisiatif membentuk tim relawan pengembang sistem berbasis open-source (Next.js, Laravel, dan PostgreSQL).\nKebutuhan relawan:\n- UI/UX Designer\n- Frontend Developer\n- Backend & DevOps Engineer\n- Digital Archivist / Content Contributor\n\nPekerjaan bersifat volunter / amal jariyah untuk kemajuan almamater. Bagi yang berminat meluangkan waktu luang, mari berkolaborasi bersama.",
                'status' => ForumThreadStatus::PUBLISHED,
                'is_pinned' => false,
                'is_locked' => false,
                'views_count' => 740,
                'last_post_at' => now()->subHours(10),
            ]
        );

        ForumPost::updateOrCreate(
            ['thread_id' => $thread6->id, 'user_id' => $alumni1->id, 'parent_id' => null],
            [
                'body' => "Saya siap berkontribusi di bagian Frontend dan komponen antarmuka ramah aksesibilitas. Project yang sangat mulia untuk masa depan madrasah!",
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        // ---------------------------------------------------------------------
        // 6. News Categories, 4 Articles, & Comments (100% Synced with newsData.ts)
        // ---------------------------------------------------------------------
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

        // News 2
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
                'user_id' => $alumni4->id,
                'author_name' => 'Budi Santoso',
                'content' => 'Alhamdulillah acara berjalan dengan sangat lancar dan penuh kenangan. Senang sekali bisa bertemu kembali dengan bapak ibu guru serta teman-teman seangkatan.',
                'is_approved' => true,
            ]
        );

        NewsComment::updateOrCreate(
            ['news_id' => $news1->id, 'author_email' => 'siti.nurhaliza@tokopedia.com'],
            [
                'user_id' => $alumni1->id,
                'author_name' => 'Siti Nurhaliza',
                'content' => 'Terima kasih untuk panitia yang sudah menyiapkan acara sebaik ini. Usul untuk reuni berikutnya diadakan sesi panel sharing karir teknologi secara khusus.',
                'is_approved' => true,
            ]
        );

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
                'user_id' => $alumni6->id,
                'author_name' => 'Farhan Hakim',
                'content' => 'Terima kasih banyak atas program beasiswa ini. Sangat membantu adik-adik angkatan yang sedang menempuh semester akhir perkuliahan.',
                'is_approved' => true,
            ]
        );

        NewsComment::updateOrCreate(
            ['news_id' => $news2->id, 'author_email' => 'dinda.lestari@ui.ac.id'],
            [
                'user_id' => null,
                'author_name' => 'Dinda Lestari',
                'content' => 'Apakah program beasiswa ini juga terbuka bagi mahasiswa yang baru menempuh semester awal perkuliahan?',
                'is_approved' => false,
            ]
        );

        // ---------------------------------------------------------------------
        // 7. Event Categories & Events (100% Synced with EventsPage.tsx)
        // ---------------------------------------------------------------------
        $eventCat = EventCategory::firstOrCreate(
            ['slug' => 'temu-alumni'],
            ['name' => 'Temu Alumni', 'description' => 'Kegiatan silaturahmi luring maupun daring.']
        );

        // Event 1: Webinar Karir Alumni
        Event::updateOrCreate(
            ['slug' => 'webinar-karir-alumni-membangun-portofolio-global'],
            [
                'category_id' => $eventCat->id,
                'created_by' => $moderator->id,
                'title' => 'Webinar Karir Alumni: Membangun Portofolio Global di Era Digital',
                'description' => 'Sesi sharing bersama para alumni praktisi industri teknologi dan bisnis internasional tentang strategi karir.',
                'cover_image' => 'events/covers/news-internasional.jpg',
                'location' => 'Online (Zoom Meeting)',
                'start_at' => now()->addDays(14)->setHour(19)->setMinute(0),
                'end_at' => now()->addDays(14)->setHour(21)->setMinute(0),
                'registration_start_at' => now()->subDay(),
                'registration_end_at' => now()->addDays(13),
                'max_participants' => 200,
                'status' => EventStatus::PUBLISHED,
            ]
        );

        // Event 2: Temu Kangen Silaturahmi Akbar
        Event::updateOrCreate(
            ['slug' => 'temu-kangen-silaturahmi-akbar-lintas-angkatan'],
            [
                'category_id' => $eventCat->id,
                'created_by' => $moderator->id,
                'title' => 'Temu Kangen & Silaturahmi Akbar Lintas Angkatan',
                'description' => 'Pertemuan akbar untuk mempererat tali persaudaraan antar generasi Mayoga dari angkatan pertama hingga yang termuda.',
                'cover_image' => 'events/covers/news-reuni.jpg',
                'location' => 'Kampus MAN 3 Sleman, Jl. Magelang Km. 4',
                'start_at' => now()->addMonths(2)->setHour(8)->setMinute(0),
                'end_at' => now()->addMonths(2)->setHour(15)->setMinute(0),
                'registration_start_at' => now()->addMonth(),
                'registration_end_at' => now()->addMonths(2)->subDays(3),
                'max_participants' => 1000,
                'status' => EventStatus::PUBLISHED,
            ]
        );

        // ---------------------------------------------------------------------
        // 8. Pending Alumni for Verification (100% Synced with adminData.ts)
        // ---------------------------------------------------------------------

        // Pending 1: Rizky Ramadhan
        $pending1 = User::updateOrCreate(
            ['email' => 'rizky.ramadhan@alumni.m3s.id'],
            [
                'name' => 'Rizky Ramadhan, S.Kom.',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::PENDING,
                'avatar' => '/images/avatar-ahmad.jpg',
            ]
        );
        AlumniProfile::updateOrCreate(
            ['user_id' => $pending1->id],
            [
                'graduation_year' => 2021,
                'graduation_class' => 'IPA 1',
                'occupation' => 'Frontend Engineer',
                'company' => 'PT Inovasi Digital Nusantara',
                'current_city' => 'Sleman, D.I. Yogyakarta',
                'current_country' => 'Indonesia',
                'visibility' => ProfileVisibility::PUBLIC,
            ]
        );

        // Pending 2: Fadhilah Anindya
        $pending2 = User::updateOrCreate(
            ['email' => 'fadhilah.anindya@alumni.m3s.id'],
            [
                'name' => 'Fadhilah Anindya, S.E.',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::PENDING,
                'avatar' => '/images/avatar-siti.jpg',
            ]
        );
        AlumniProfile::updateOrCreate(
            ['user_id' => $pending2->id],
            [
                'graduation_year' => 2019,
                'graduation_class' => 'IPS 2',
                'occupation' => 'Financial Analyst',
                'company' => 'Bank Syariah Indonesia',
                'current_city' => 'Jakarta Selatan',
                'current_country' => 'Indonesia',
                'visibility' => ProfileVisibility::PUBLIC,
            ]
        );

        // Pending 3: Muhammad Ihsan Kamil
        $pending3 = User::updateOrCreate(
            ['email' => 'ihsan.kamil@alumni.m3s.id'],
            [
                'name' => 'Muhammad Ihsan Kamil',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::PENDING,
                'avatar' => '/images/avatar-ahmad.jpg',
            ]
        );
        AlumniProfile::updateOrCreate(
            ['user_id' => $pending3->id],
            [
                'graduation_year' => 2023,
                'graduation_class' => 'Keagamaan 1',
                'occupation' => 'Mahasiswa UIN Sunan Kalijaga',
                'company' => 'Fakultas Ushuluddin',
                'current_city' => 'Yogyakarta',
                'current_country' => 'Indonesia',
                'visibility' => ProfileVisibility::PUBLIC,
            ]
        );

        // ---------------------------------------------------------------------
        // 9. Moderation Reports (100% Synced with adminData.ts)
        // ---------------------------------------------------------------------

        // Report 1: Spam loan reply on Topic 1
        $spamPost = ForumPost::firstOrCreate(
            ['thread_id' => $thread1->id, 'body' => 'Halo semua, dapatkan pinjaman dana kilat bunga 0% hubungi wa.me/6281299998888 proses 5 menit cair!'],
            [
                'user_id' => $pending1->id,
                'status' => ForumPostStatus::PUBLISHED,
            ]
        );

        Report::updateOrCreate(
            [
                'reportable_type' => ForumPost::class,
                'reportable_id' => $spamPost->id,
            ],
            [
                'user_id' => $alumni1->id,
                'reason' => 'spam',
                'description' => 'Komentar berisi promosi pinjaman online ilegal yang tidak ada kaitannya dengan agenda reuni madrasah.',
                'status' => ReportStatus::PENDING,
            ]
        );

        // Report 2: Spam chip thread
        $spamThread = ForumThread::firstOrCreate(
            ['slug' => 'jual-akun-game-chip-murah-terpercaya-garansi-resmi'],
            [
                'category_id' => $catMap['diskusi-umum']->id,
                'user_id' => $pending3->id,
                'title' => 'Jual Akun Game & Chip Murah Terpercaya Garansi Resmi',
                'body' => 'Bagi rekan-rekan yang butuh chip game terpercaya bisa langsung transfer ke rekening admin berikut...',
                'status' => ForumThreadStatus::PUBLISHED,
                'is_pinned' => false,
                'is_locked' => false,
                'views_count' => 12,
                'last_post_at' => now(),
            ]
        );

        Report::updateOrCreate(
            [
                'reportable_type' => ForumThread::class,
                'reportable_id' => $spamThread->id,
            ],
            [
                'user_id' => $alumni4->id,
                'reason' => 'spam',
                'description' => 'Akun baru membuat thread jualan tidak berizin di kategori Diskusi Umum.',
                'status' => ReportStatus::PENDING,
            ]
        );

        // Report 3: Impersonation Profile (Hendra Saputra)
        $fakeUser = User::firstOrCreate(
            ['email' => 'hendra.fake@example.com'],
            [
                'name' => 'Hendra Saputra',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::ALUMNI,
                'status' => UserStatus::PENDING,
                'avatar' => '/images/avatar-ahmad.jpg',
            ]
        );
        $fakeProfile = AlumniProfile::firstOrCreate(
            ['user_id' => $fakeUser->id],
            [
                'graduation_year' => 2015,
                'graduation_class' => 'IPA 1',
                'occupation' => 'Freelance',
                'company' => 'Self Employed',
                'current_city' => 'Yogyakarta',
                'visibility' => ProfileVisibility::PUBLIC,
            ]
        );

        Report::updateOrCreate(
            [
                'reportable_type' => AlumniProfile::class,
                'reportable_id' => $fakeProfile->id,
            ],
            [
                'user_id' => $alumni2->id,
                'reason' => 'impersonation',
                'description' => 'Mohon diverifikasi ulang keabsahan ijazah karena ada indikasi klaim identitas alumni palsu.',
                'status' => ReportStatus::REVIEWING,
            ]
        );

        // ---------------------------------------------------------------------
        // 8. Documentation & Activity Photo Galleries (Synced with frontend ALBUMS)
        // ---------------------------------------------------------------------
        Documentation::updateOrCreate(
            ['slug' => 'reuni-akbar-2025'],
            [
                'title' => 'Reuni Akbar 2025',
                'category' => 'Reuni & Temu Kangen',
                'event_date' => '2025-05-12',
                'photo_count' => 128,
                'cover_image' => '/images/news-reuni.jpg',
                'photos' => [
                    '/images/news-reuni.jpg',
                    '/images/hero-building.jpg',
                    '/images/hero-man3-sleman.jpg',
                    '/images/news-peluncuran.jpg',
                ],
                'description' => 'Dokumentasi kemeriahan temu kangen alumni lintas angkatan yang berlangsung di halaman kampus MAN 3 Sleman.',
                'is_featured' => true,
                'status' => 'published',
                'published_at' => '2025-05-12 10:00:00',
            ]
        );

        Documentation::updateOrCreate(
            ['slug' => 'kegiatan-bakti-sosial-penyaluran-donasi'],
            [
                'title' => 'Kegiatan Bakti Sosial & Penyaluran Donasi',
                'category' => 'Sosial & Pengabdian',
                'event_date' => '2025-04-20',
                'photo_count' => 45,
                'cover_image' => '/images/doc-baksos.jpg',
                'photos' => [
                    '/images/doc-baksos.jpg',
                    '/images/news-beasiswa.jpg',
                ],
                'description' => 'Aksi nyata kepedulian alumni dalam bakti sosial dan bantuan pendidikan untuk warga sekitar Sleman.',
                'is_featured' => true,
                'status' => 'published',
                'published_at' => '2025-04-20 09:00:00',
            ]
        );

        Documentation::updateOrCreate(
            ['slug' => 'wisuda-pelepasan-siswa-kelas-xii'],
            [
                'title' => 'Wisuda & Pelepasan Siswa Kelas XII',
                'category' => 'Seremoni Madrasah',
                'event_date' => '2024-06-15',
                'photo_count' => 84,
                'cover_image' => '/images/doc-wisuda.jpg',
                'photos' => [
                    '/images/doc-wisuda.jpg',
                    '/images/news-internasional.jpg',
                ],
                'description' => 'Momen bersejarah pelepasan wisudawan dan peresmian bergabungnya angkatan baru ke dalam keluarga besar alumni.',
                'is_featured' => true,
                'status' => 'published',
                'published_at' => '2024-06-15 08:30:00',
            ]
        );
    }
}
