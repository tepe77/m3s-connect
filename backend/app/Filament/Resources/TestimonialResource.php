<?php

namespace App\Filament\Resources;

use App\Enums\TestimonialStatus;
use App\Filament\Resources\TestimonialResource\Pages;
use App\Models\Testimonial;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static ?string $navigationGroup = 'Publikasi & Berita';

    protected static ?string $navigationLabel = 'Testimoni Alumni';

    protected static ?string $modelLabel = 'Testimoni';

    protected static ?string $pluralModelLabel = 'Testimoni Alumni';

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-bottom-center-text';

    protected static ?int $navigationSort = 4;

    public static function getNavigationBadge(): ?string
    {
        $pendingCount = Testimonial::where('status', TestimonialStatus::PENDING)->count();
        return $pendingCount > 0 ? (string) $pendingCount : null;
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
                        // Left Column: Testimonial Content & Rating (8 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Konten Testimoni & Kesan Alumni')
                                ->schema([
                                    Forms\Components\Textarea::make('content')
                                        ->label('Kutipan Testimoni')
                                        ->placeholder('Tuliskan kesan, pesan, pengalaman belajar, atau inspirasi karir alumni...')
                                        ->required()
                                        ->rows(5)
                                        ->maxLength(1000)
                                        ->columnSpanFull(),

                                    Forms\Components\Grid::make(3)
                                        ->schema([
                                            Forms\Components\Select::make('rating')
                                                ->label('Rating Bintang')
                                                ->options([
                                                    5 => '⭐⭐⭐⭐⭐ (5 Bintang)',
                                                    4 => '⭐⭐⭐⭐ (4 Bintang)',
                                                    3 => '⭐⭐⭐ (3 Bintang)',
                                                    2 => '⭐⭐ (2 Bintang)',
                                                    1 => '⭐ (1 Bintang)',
                                                ])
                                                ->default(5)
                                                ->required(),

                                            Forms\Components\TextInput::make('position')
                                                ->label('Jabatan / Profesi')
                                                ->placeholder('Misal: Lead AI Engineer'),

                                            Forms\Components\TextInput::make('company')
                                                ->label('Instansi / Perusahaan')
                                                ->placeholder('Misal: GoTo Financial'),
                                        ]),

                                    Forms\Components\TextInput::make('graduation_year')
                                        ->label('Tahun Kelulusan / Angkatan')
                                        ->placeholder('Contoh: 2018')
                                        ->maxLength(20),
                                ]),
                        ])->columnSpan(['lg' => 8]),

                        // Right Column: Author Identity & Moderation Status (4 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Identitas Penulis Testimoni')
                                ->schema([
                                    Forms\Components\Select::make('user_id')
                                        ->label('Akun Pengguna Terdaftar')
                                        ->relationship('user', 'name')
                                        ->searchable()
                                        ->preload()
                                        ->placeholder('Pilih Alumni (Opsional)')
                                        ->helperText('Jika terhubung dengan akun terdaftar, nama dan avatar akan otomatis terisi.'),

                                    Forms\Components\TextInput::make('author_name')
                                        ->label('Nama Manual (Jika Tanpa Akun)')
                                        ->placeholder('Misal: Dr. H. Ahmad Fauzi')
                                        ->helperText('Diisi jika testimoni merupakan kutipan tokoh alumni yang belum memiliki akun.'),

                                    Forms\Components\FileUpload::make('author_avatar')
                                        ->label('Foto Profil Manual')
                                        ->image()
                                        ->disk('public')
                                        ->directory('testimonials/avatars')
                                        ->visibility('public')
                                        ->imageEditor()
                                        ->helperText('Unggah foto portrait jika testimoni diisi manual.'),
                                ]),

                            Forms\Components\Section::make('Status & Moderasi')
                                ->schema([
                                    Forms\Components\Select::make('status')
                                        ->label('Status Moderasi')
                                        ->options([
                                            'pending' => 'Menunggu Review (Pending)',
                                            'approved' => 'Disetujui & Tayang (Approved)',
                                            'rejected' => 'Ditolak (Rejected)',
                                            'archived' => 'Diarsipkan (Archived)',
                                        ])
                                        ->default('approved')
                                        ->required(),

                                    Forms\Components\Toggle::make('is_featured')
                                        ->label('Sorotan Utama (Featured)')
                                        ->helperText('Prioritaskan testimoni ini untuk tampil di baris terdepan Marquee Beranda.')
                                        ->default(true),

                                    Forms\Components\DateTimePicker::make('published_at')
                                        ->label('Waktu Publikasi')
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
                Tables\Columns\ImageColumn::make('display_avatar')
                    ->label('Foto')
                    ->circular()
                    ->disk('public')
                    ->checkFileExistence(false)
                    ->getStateUsing(fn (Testimonial $record): string => $record->display_avatar),

                Tables\Columns\TextColumn::make('display_name')
                    ->label('Nama Alumni')
                    ->searchable(['author_name', 'users.name'])
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (Testimonial $record): string => $record->display_role),

                Tables\Columns\TextColumn::make('content')
                    ->label('Kutipan Testimoni')
                    ->limit(65)
                    ->tooltip(fn (Testimonial $record): string => $record->content)
                    ->wrap(),

                Tables\Columns\TextColumn::make('rating')
                    ->label('Rating')
                    ->formatStateUsing(fn (int $state): string => str_repeat('★', $state))
                    ->color('warning')
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger' => 'rejected',
                        'gray' => 'archived',
                    ]),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Diajukan')
                    ->date('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending Review',
                        'approved' => 'Approved (Tayang)',
                        'rejected' => 'Rejected',
                        'archived' => 'Archived',
                    ]),

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Hanya Featured'),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('Setujui')
                    ->icon('heroicon-m-check-circle')
                    ->color('success')
                    ->visible(fn (Testimonial $record): bool => $record->status !== TestimonialStatus::APPROVED)
                    ->action(function (Testimonial $record): void {
                        $record->update([
                            'status' => TestimonialStatus::APPROVED,
                            'published_at' => now(),
                        ]);

                        Notification::make()
                            ->title('Testimoni Disetujui')
                            ->body("Testimoni dari {$record->display_name} sekarang tampil di Beranda.")
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('reject')
                    ->label('Tolak')
                    ->icon('heroicon-m-x-circle')
                    ->color('danger')
                    ->visible(fn (Testimonial $record): bool => $record->status === TestimonialStatus::PENDING)
                    ->requiresConfirmation()
                    ->action(function (Testimonial $record): void {
                        $record->update([
                            'status' => TestimonialStatus::REJECTED,
                        ]);

                        Notification::make()
                            ->title('Testimoni Ditolak')
                            ->body("Testimoni dari {$record->display_name} telah ditolak.")
                            ->warning()
                            ->send();
                    }),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('approve_selected')
                        ->label('Setujui Terpilih')
                        ->icon('heroicon-m-check-badge')
                        ->color('success')
                        ->action(fn ($records) => $records->each->update([
                            'status' => TestimonialStatus::APPROVED,
                            'published_at' => now(),
                        ])),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'edit' => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }
}
