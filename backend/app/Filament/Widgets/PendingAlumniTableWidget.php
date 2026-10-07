<?php

namespace App\Filament\Widgets;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Filament\Resources\AlumniVerificationResource;
use App\Models\AlumniProfile;
use App\Models\User;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PendingAlumniTableWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Verifikasi Calon Alumni Menunggu Persetujuan';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                User::query()
                    ->where('role', UserRole::ALUMNI)
                    ->where('status', UserStatus::PENDING)
                    ->with('profile')
                    ->latest()
            )
            ->heading('Verifikasi Calon Alumni Menunggu Persetujuan')
            ->description('Daftar pendaftar alumni baru yang membutuhkan verifikasi keabsahan data ijazah.')
            ->columns([
                Tables\Columns\ImageColumn::make('avatar')
                    ->label('Foto')
                    ->circular(),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Lengkap')
                    ->description(fn (User $record): string => $record->email)
                    ->searchable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('profile.graduation_year')
                    ->label('Angkatan')
                    ->badge()
                    ->color('success'),

                Tables\Columns\TextColumn::make('profile.graduation_class')
                    ->label('Kelas')
                    ->placeholder('Tidak Diisi'),

                Tables\Columns\TextColumn::make('profile.alumni_identifier')
                    ->label('Nomor Anggota (NPA)')
                    ->fontFamily('mono')
                    ->placeholder('Belum Diterbitkan'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Waktu Daftar')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('Setujui & Terbitkan NPA')
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
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
                            ->placeholder('Misal: Data kelulusan belum terverifikasi di buku induk madrasah...')
                            ->required(),
                    ])
                    ->action(function (User $record, array $data): void {
                        $record->update(['status' => UserStatus::SUSPENDED]);

                        Notification::make()
                            ->title('Pendaftaran Ditolak')
                            ->body("Pendaftaran alumni atas nama {$record->name} telah ditangguhkan.")
                            ->danger()
                            ->send();
                    }),
            ])
            ->headerActions([
                Tables\Actions\Action::make('view_all')
                    ->label('Buka Semua Antrean Verifikasi')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(AlumniVerificationResource::getUrl('index')),
            ])
            ->emptyStateHeading('Tidak Ada Antrean Verifikasi')
            ->emptyStateDescription('Semua calon alumni yang mendaftar telah selesai diverifikasi oleh tim staf.')
            ->emptyStateIcon('heroicon-o-check-circle');
    }
}
