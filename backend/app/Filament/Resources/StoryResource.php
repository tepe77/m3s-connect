<?php

namespace App\Filament\Resources;

use App\Enums\StoryStatus;
use App\Filament\Resources\StoryResource\Pages;
use App\Models\Story;
use Filament\Forms;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class StoryResource extends Resource
{
    protected static ?string $model = Story::class;

    protected static ?string $navigationGroup = 'Publikasi & Berita';

    protected static ?string $navigationLabel = 'Kisah Alumni';

    protected static ?string $modelLabel = 'Kisah Alumni';

    protected static ?string $pluralModelLabel = 'Kisah & Riwayat Alumni';

    protected static ?string $navigationIcon = 'heroicon-o-book-open';

    protected static ?int $navigationSort = 3;

    public static function getNavigationBadge(): ?string
    {
        $count = Story::where('status', StoryStatus::PENDING_REVIEW)->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make(12)
                    ->schema([
                        // Left Column: Editorial & Story Content (8 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Naskah & Narasi Kisah Alumni')
                                ->schema([
                                    Forms\Components\TextInput::make('title')
                                        ->label('Judul Kisah Inspiratif')
                                        ->placeholder('Contoh: Dari Mayoga Menembus Panggung Teknologi Internasional')
                                        ->required()
                                        ->maxLength(255)
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(function (string $operation, ?string $state, Forms\Set $set): void {
                                            if ($operation === 'create' && filled($state)) {
                                                $set('slug', Str::slug($state));
                                            }
                                        }),

                                    Forms\Components\TextInput::make('slug')
                                        ->label('Slug URL Kisah')
                                        ->placeholder('judul-kisah-alumni-otomatis')
                                        ->required()
                                        ->maxLength(255)
                                        ->unique(Story::class, 'slug', ignoreRecord: true)
                                        ->helperText('Otomatis dihasilkan dari judul artikel.')
                                        ->suffixAction(
                                            Action::make('generateSlug')
                                                ->icon('heroicon-m-arrow-path')
                                                ->tooltip('Buat ulang slug dari judul saat ini')
                                                ->action(function (Forms\Get $get, Forms\Set $set): void {
                                                    $title = $get('title');
                                                    if (filled($title)) {
                                                        $set('slug', Str::slug($title));
                                                    }
                                                })
                                        ),

                                    Forms\Components\Textarea::make('excerpt')
                                        ->label('Kutipan Inspiratif / Ringkasan (Excerpt)')
                                        ->placeholder('Tuliskan ringkasan 2 sampai 3 kalimat yang memikat pembaca di halaman depan...')
                                        ->rows(3)
                                        ->maxLength(500)
                                        ->columnSpanFull(),

                                    Forms\Components\RichEditor::make('content')
                                        ->label('Isi Lengkap Perjalanan Alumni')
                                        ->placeholder('Tuliskan kisah lengkap masa belajar di Mayoga, perjuangan kuliah, hingga pencapaian dan pelajaran hidup saat ini...')
                                        ->required()
                                        ->toolbarButtons([
                                            'attachFiles',
                                            'blockquote',
                                            'bold',
                                            'bulletList',
                                            'codeBlock',
                                            'h2',
                                            'h3',
                                            'italic',
                                            'link',
                                            'orderedList',
                                            'redo',
                                            'strike',
                                            'underline',
                                            'undo',
                                        ])
                                        ->fileAttachmentsDisk('public')
                                        ->fileAttachmentsDirectory('stories/attachments')
                                        ->columnSpanFull(),
                                ]),
                        ])->columnSpan(['lg' => 8]),

                        // Right Column: Author, Category & Moderation (4 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Identitas Alumni')
                                ->schema([
                                    Forms\Components\Select::make('user_id')
                                        ->label('Akun Pengguna Terdaftar')
                                        ->relationship('user', 'name')
                                        ->searchable()
                                        ->preload()
                                        ->placeholder('Pilih Alumni Terdaftar (Opsional)')
                                        ->helperText('Pilih jika kisah ditulis oleh pengguna terdaftar.'),

                                    Forms\Components\TextInput::make('author_name')
                                        ->label('Nama Alumni (Jika Manual)')
                                        ->placeholder('Contoh: Budi Santoso, S.Kom.')
                                        ->helperText('Diisi jika profil merupakan liputan redaksi terhadap alumni yang belum mendaftar.'),

                                    Forms\Components\FileUpload::make('author_avatar')
                                        ->label('Foto Profil Alumni')
                                        ->image()
                                        ->disk('public')
                                        ->directory('stories/avatars')
                                        ->visibility('public')
                                        ->imageEditor()
                                        ->helperText('Unggah foto portrait alumni.'),

                                    Forms\Components\TextInput::make('graduation_year')
                                        ->label('Angkatan / Tahun Kelulusan')
                                        ->placeholder('Contoh: 2018 (IPA 2)')
                                        ->maxLength(50),

                                    Forms\Components\TextInput::make('profession')
                                        ->label('Profesi / Jabatan')
                                        ->placeholder('Contoh: Senior Software Engineer'),

                                    Forms\Components\TextInput::make('company')
                                        ->label('Instansi / Perusahaan')
                                        ->placeholder('Contoh: Google Singapore / RS Sardjito'),
                                ]),

                            Forms\Components\Section::make('Kategori & Media')
                                ->schema([
                                    Forms\Components\Select::make('category')
                                        ->label('Bidang / Industri')
                                        ->options([
                                            'Teknologi & Rekayasa' => 'Teknologi & Rekayasa',
                                            'Bisnis & Wirausaha' => 'Bisnis & Wirausaha',
                                            'Akademisi & Riset' => 'Akademisi & Riset',
                                            'Kesehatan & Medis' => 'Kesehatan & Medis',
                                            'Seni & Komunikasi' => 'Seni & Komunikasi',
                                            'Pengabdian & Sosial' => 'Pengabdian & Sosial',
                                            'Pemerintahan & Hukum' => 'Pemerintahan & Hukum',
                                        ])
                                        ->default('Teknologi & Rekayasa')
                                        ->required(),

                                    Forms\Components\FileUpload::make('cover_image')
                                        ->label('Foto Cover Artikel')
                                        ->image()
                                        ->disk('public')
                                        ->directory('stories/covers')
                                        ->visibility('public')
                                        ->imageEditor()
                                        ->helperText('Format lanskap rasio 16:9 disarankan.'),

                                    Forms\Components\TextInput::make('reading_time')
                                        ->label('Estimasi Waktu Baca (Menit)')
                                        ->numeric()
                                        ->default(4)
                                        ->minValue(1)
                                        ->maxValue(60),

                                    Forms\Components\Toggle::make('is_featured')
                                        ->label('Jadikan Sorotan Utama (Featured)')
                                        ->helperText('Tampilkan di bagian atas halaman sebagai Headline Story.')
                                        ->default(false),
                                ]),

                            Forms\Components\Section::make('Status & Publikasi')
                                ->schema([
                                    Forms\Components\Select::make('status')
                                        ->label('Status Moderasi')
                                        ->options([
                                            'draft' => 'Draf Redaksi (Draft)',
                                            'pending_review' => 'Menunggu Review (Pending)',
                                            'published' => 'Disetujui & Tayang (Published)',
                                            'rejected' => 'Ditolak (Rejected)',
                                            'archived' => 'Diarsipkan (Archived)',
                                        ])
                                        ->default('published')
                                        ->required(),

                                    Forms\Components\DateTimePicker::make('published_at')
                                        ->label('Tanggal Publikasi')
                                        ->default(now())
                                        ->native(false),
                                ]),
                        ])->columnSpan(['lg' => 4]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image')
                    ->label('Cover')
                    ->disk('public')
                    ->defaultImageUrl('/images/hero-alumni-m3s.jpg')
                    ->square(),

                Tables\Columns\TextColumn::make('title')
                    ->label('Judul Kisah & Penulis')
                    ->searchable(['title', 'author_name', 'users.name'])
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (Story $record): string => "Oleh: {$record->display_author} • {$record->display_role}")
                    ->wrap(),

                Tables\Columns\TextColumn::make('category')
                    ->label('Bidang')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('graduation_year')
                    ->label('Angkatan')
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'gray' => 'draft',
                        'warning' => 'pending_review',
                        'success' => 'published',
                        'danger' => 'rejected',
                        'secondary' => 'archived',
                    ]),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Tayang')
                    ->date('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('published_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'draft' => 'Draft',
                        'pending_review' => 'Pending Review',
                        'published' => 'Published',
                        'rejected' => 'Rejected',
                        'archived' => 'Archived',
                    ]),

                Tables\Filters\SelectFilter::make('category')
                    ->label('Bidang')
                    ->options([
                        'Teknologi & Rekayasa' => 'Teknologi & Rekayasa',
                        'Bisnis & Wirausaha' => 'Bisnis & Wirausaha',
                        'Akademisi & Riset' => 'Akademisi & Riset',
                        'Kesehatan & Medis' => 'Kesehatan & Medis',
                        'Seni & Komunikasi' => 'Seni & Komunikasi',
                        'Pengabdian & Sosial' => 'Pengabdian & Sosial',
                    ]),

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Hanya Featured'),

                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\Action::make('publish')
                    ->label('Terbitkan')
                    ->icon('heroicon-m-check-circle')
                    ->color('success')
                    ->visible(fn (Story $record): bool => $record->status !== StoryStatus::PUBLISHED)
                    ->action(function (Story $record): void {
                        $record->update([
                            'status' => StoryStatus::PUBLISHED,
                            'published_at' => $record->published_at ?? now(),
                        ]);

                        Notification::make()
                            ->title('Kisah Diterbitkan')
                            ->body("Kisah '{$record->title}' berhasil dipublikasikan.")
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('reject')
                    ->label('Tolak')
                    ->icon('heroicon-m-x-circle')
                    ->color('danger')
                    ->visible(fn (Story $record): bool => $record->status === StoryStatus::PENDING_REVIEW)
                    ->requiresConfirmation()
                    ->action(function (Story $record): void {
                        $record->update([
                            'status' => StoryStatus::REJECTED,
                        ]);

                        Notification::make()
                            ->title('Kisah Ditolak')
                            ->body("Kisah '{$record->title}' telah ditolak.")
                            ->warning()
                            ->send();
                    }),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('publish_selected')
                        ->label('Terbitkan Terpilih')
                        ->icon('heroicon-m-check-badge')
                        ->color('success')
                        ->action(fn ($records) => $records->each->update([
                            'status' => StoryStatus::PUBLISHED,
                            'published_at' => now(),
                        ])),
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListStories::route('/'),
            'create' => Pages\CreateStory::route('/create'),
            'edit' => Pages\EditStory::route('/{record}/edit'),
        ];
    }
}
