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
            ->with('profile');
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
                    ->label('Nama Lengkap')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('profile.graduation_year')
                    ->label('Angkatan')
                    ->badge()
                    ->color('success')
                    ->sortable(),
                Tables\Columns\TextColumn::make('profile.graduation_class')
                    ->label('Kelas')
                    ->searchable(),
                Tables\Columns\TextColumn::make('profile.alumni_identifier')
                    ->label('Nomor Anggota (NPA)')
                    ->fontFamily('mono')
                    ->placeholder('Belum Diterbitkan')
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
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tgl Mendaftar')
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
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('Setujui & Terbitkan NPA')
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (User $record): bool => $record->status === UserStatus::PENDING || $record->status === 'pending')
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
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->form([
                        Forms\Components\Textarea::make('reason')
                            ->label('Alasan Penolakan')
                            ->placeholder('Misal: Data ijazah tidak sesuai dengan catatan madrasah...')
                            ->required(),
                    ])
                    ->visible(fn (User $record): bool => $record->status === UserStatus::PENDING || $record->status === 'pending')
                    ->action(function (User $record, array $data): void {
                        $record->update(['status' => UserStatus::SUSPENDED]);

                        Notification::make()
                            ->title('Pendaftaran Ditolak')
                            ->body("Pendaftaran alumni atas nama {$record->name} telah ditangguhkan.")
                            ->danger()
                            ->send();
                    }),

                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
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
