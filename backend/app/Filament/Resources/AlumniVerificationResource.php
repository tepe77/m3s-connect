<?php

namespace App\Filament\Resources;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Filament\Resources\AlumniVerificationResource\Pages;
use App\Models\AlumniProfile;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AlumniVerificationResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationGroup = 'Manajemen Alumni';

    protected static ?string $navigationLabel = 'Verifikasi Calon Alumni';

    protected static ?string $modelLabel = 'Calon Alumni';

    protected static ?string $pluralModelLabel = 'Verifikasi Calon Alumni';

    protected static ?string $navigationIcon = 'heroicon-o-identification';

    protected static ?int $navigationSort = 1;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('role', UserRole::ALUMNI)
            ->with('profile')
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getNavigationBadge(): ?string
    {
        $count = User::where('role', UserRole::ALUMNI)
            ->where('status', UserStatus::PENDING)
            ->count();

        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Data Akun Alumni')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama Lengkap')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('email')
                            ->label('Alamat Email')
                            ->email()
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('status')
                            ->label('Status Akun')
                            ->options([
                                'pending' => 'Menunggu Verifikasi (Pending)',
                                'active' => 'Terverifikasi & Aktif (Active)',
                                'suspended' => 'Ditolak / Dinonaktifkan (Suspended)',
                            ])
                            ->required(),
                    ])->columns(3),
                Forms\Components\Section::make('Data Profil & Keanggotaan')
                    ->relationship('profile')
                    ->schema([
                        Forms\Components\TextInput::make('graduation_year')
                            ->label('Tahun Angkatan')
                            ->numeric()
                            ->required(),
                        Forms\Components\TextInput::make('graduation_class')
                            ->label('Kelas / Jurusan'),
                        Forms\Components\TextInput::make('alumni_identifier')
                            ->label('Nomor Anggota (NPA)')
                            ->placeholder('Otomatis diterbitkan saat disetujui'),
                        Forms\Components\DateTimePicker::make('verified_at')
                            ->label('Waktu Terverifikasi'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('avatar')
                    ->label('Foto')
                    ->circular()
                    ->disk('public')
                    ->defaultImageUrl(asset('images/avatar-ahmad.jpg'))
                    ->checkFileExistence(false)
                    ->getStateUsing(fn (User $record): ?string => $record->avatar_url),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama & Email')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (User $record): string => $record->email),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('profile.graduation_year')
                    ->label('Angkatan')
                    ->badge()
                    ->color('success')
                    ->sortable()
                    ->description(fn (User $record): ?string => $record->profile?->graduation_class ? 'Kelas ' . $record->profile->graduation_class : null),
                Tables\Columns\TextColumn::make('profile.graduation_class')
                    ->label('Kelas')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('profile.alumni_identifier')
                    ->label('NPA')
                    ->fontFamily('mono')
                    ->placeholder('—')
                    ->copyable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (UserStatus|string $state): string => match ($state instanceof UserStatus ? $state->value : $state) {
                        'pending' => 'warning',
                        'active' => 'success',
                        'suspended' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\IconColumn::make('profile.is_featured')
                    ->label('Beranda')
                    ->boolean()
                    ->trueIcon('heroicon-s-star')
                    ->falseIcon('heroicon-o-star')
                    ->trueColor('warning')
                    ->falseColor('gray')
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Mendaftar')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Filter Status')
                    ->options([
                        'pending' => 'Menunggu Verifikasi',
                        'active' => 'Terverifikasi',
                        'suspended' => 'Ditolak / Ditangguhkan',
                    ]),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Status Pilihan Beranda')
                    ->placeholder('Semua Alumni')
                    ->trueLabel('Hanya Alumni Pilihan (Featured)')
                    ->falseLabel('Bukan Alumni Pilihan')
                    ->queries(
                        true: fn (Builder $query) => $query->whereHas('profile', fn ($q) => $q->where('is_featured', true)),
                        false: fn (Builder $query) => $query->whereHas('profile', fn ($q) => $q->where('is_featured', false)),
                    ),
                Tables\Filters\TrashedFilter::make()
                    ->label('Status Penghapusan (Sampah)'),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('Setujui')
                    ->icon('heroicon-m-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (User $record): bool => ($record->status === UserStatus::PENDING || $record->status === 'pending') && !$record->trashed())
                    ->action(function (User $record): void {
                        $record->update(['status' => UserStatus::ACTIVE]);

                        if ($record->profile) {
                            $year = $record->profile->graduation_year ?? 2020;
                            $identifier = $record->profile->alumni_identifier;

                            if (!$identifier) {
                                $identifier = AlumniProfile::generateIdentifier($year);
                            }

                            $record->profile->update([
                                'alumni_identifier' => $identifier,
                                'verified_at' => now(),
                            ]);
                        }

                        Notification::make()
                            ->title('Alumni Berhasil Diverifikasi')
                            ->body("Akun {$record->name} telah aktif dan Nomor Anggota resmi diterbitkan.")
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('reject')
                    ->label('Tolak')
                    ->icon('heroicon-m-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->form([
                        Forms\Components\Textarea::make('reason')
                            ->label('Alasan Penolakan')
                            ->placeholder('Misal: Data ijazah tidak sesuai dengan catatan madrasah...')
                            ->required(),
                    ])
                    ->visible(fn (User $record): bool => ($record->status === UserStatus::PENDING || $record->status === 'pending') && !$record->trashed())
                    ->action(function (User $record, array $data): void {
                        $record->update(['status' => UserStatus::SUSPENDED]);

                        Notification::make()
                            ->title('Pendaftaran Ditolak')
                            ->body("Pendaftaran alumni atas nama {$record->name} telah ditangguhkan.")
                            ->danger()
                            ->send();
                    }),

                Tables\Actions\Action::make('preview_portal')
                    ->label('Lihat Profil')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->color('gray')
                    ->visible(fn (User $record): bool => ($record->status === UserStatus::ACTIVE || $record->status === 'active') && $record->profile !== null && !$record->trashed())
                    ->url(fn (User $record): string => rtrim(config('app.frontend_url', env('FRONTEND_URL', 'https://alumni.mayoga.sch.id')), '/') . '/alumni/' . ($record->profile->slug ?: $record->profile->id))
                    ->openUrlInNewTab(),

                Tables\Actions\ActionGroup::make([
                    Tables\Actions\Action::make('toggleFeatured')
                        ->label(fn (User $record): string => $record->profile?->is_featured ? 'Batal Alumni Pilihan' : 'Jadikan Alumni Pilihan')
                        ->icon(fn (User $record): string => $record->profile?->is_featured ? 'heroicon-s-star' : 'heroicon-o-star')
                        ->color(fn (User $record): string => $record->profile?->is_featured ? 'warning' : 'gray')
                        ->visible(fn (User $record): bool => ($record->status === UserStatus::ACTIVE || $record->status === 'active') && $record->profile !== null && !$record->trashed())
                        ->action(function (User $record): void {
                            if ($record->profile) {
                                $newVal = !$record->profile->is_featured;
                                $record->profile->update(['is_featured' => $newVal]);

                                Notification::make()
                                    ->title($newVal ? 'Disematkan sebagai Alumni Pilihan' : 'Dihapus dari Alumni Pilihan')
                                    ->body("Profil {$record->name} " . ($newVal ? "kini akan ditampilkan di carousel Alumni Pilihan di beranda." : "tidak lagi ditampilkan di beranda."))
                                    ->success()
                                    ->send();
                            }
                        }),

                    Tables\Actions\EditAction::make(),
                    Tables\Actions\DeleteAction::make(),
                    Tables\Actions\RestoreAction::make(),
                    Tables\Actions\ForceDeleteAction::make(),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAlumniVerifications::route('/'),
        ];
    }
}
