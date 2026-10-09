<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactMessageResource\Pages;
use App\Models\ContactMessage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ContactMessageResource extends Resource
{
    protected static ?string $model = ContactMessage::class;

    protected static ?string $navigationGroup = 'Layanan & Sekretariat';

    protected static ?string $navigationLabel = 'Pesan Masuk Kontak';

    protected static ?string $modelLabel = 'Pesan Masuk';

    protected static ?string $pluralModelLabel = 'Pesan Masuk Kontak';

    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        try {
            if (! \Illuminate\Support\Facades\Schema::hasTable('contact_messages')) {
                return null;
            }
            $unreadCount = static::getModel()::where('status', 'unread')->count();
            return $unreadCount > 0 ? (string) $unreadCount : null;
        } catch (\Throwable $e) {
            return null;
        }
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'danger';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Pengirim')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama Lengkap')
                            ->disabled(),
                        Forms\Components\TextInput::make('email')
                            ->label('Alamat Email')
                            ->disabled(),
                        Forms\Components\TextInput::make('phone')
                            ->label('Nomor Telepon / WhatsApp')
                            ->disabled(),
                        Forms\Components\TextInput::make('graduation_year')
                            ->label('Angkatan Lulusan (Alumni)')
                            ->disabled(),
                        Forms\Components\TextInput::make('category')
                            ->label('Kategori Pesan')
                            ->disabled(),
                        Forms\Components\TextInput::make('ip_address')
                            ->label('Alamat IP Pengirim')
                            ->disabled(),
                    ])->columns(3),

                Forms\Components\Section::make('Isi Pesan')
                    ->schema([
                        Forms\Components\TextInput::make('subject')
                            ->label('Subjek')
                            ->disabled()
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('message')
                            ->label('Pesan Lengkap')
                            ->disabled()
                            ->rows(6)
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Status & Tindak Lanjut Tim Sekretariat')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Status Penanganan')
                            ->options([
                                'unread' => 'Belum Dibaca (Unread)',
                                'read' => 'Sudah Dibaca (Read)',
                                'replied' => 'Sudah Dibalas (Replied)',
                                'spam' => 'Spam / Ditolak (Spam)',
                                'archived' => 'Diarsipkan (Archived)',
                            ])
                            ->required(),
                        Forms\Components\Textarea::make('admin_notes')
                            ->label('Catatan Internal Admin / Sekretariat')
                            ->placeholder('Contoh: Sudah dihubungi via WA/Email pada tanggal 10 Oktober 2026 oleh Sekretariat...')
                            ->rows(3),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Waktu Masuk')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Pengirim')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->copyable()
                    ->icon('heroicon-m-envelope')
                    ->color('primary'),
                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'verifikasi' => 'warning',
                        'legalisir' => 'info',
                        'donasi' => 'success',
                        'kemitraan' => 'primary',
                        'kegiatan' => 'secondary',
                        default => 'gray',
                    })
                    ->searchable(),
                Tables\Columns\TextColumn::make('subject')
                    ->label('Subjek')
                    ->limit(35)
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'unread' => 'danger',
                        'read' => 'warning',
                        'replied' => 'success',
                        'spam' => 'gray',
                        'archived' => 'secondary',
                        default => 'gray',
                    }),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Filter Status')
                    ->options([
                        'unread' => 'Belum Dibaca',
                        'read' => 'Sudah Dibaca',
                        'replied' => 'Sudah Dibalas',
                        'spam' => 'Spam',
                        'archived' => 'Diarsipkan',
                    ]),
                Tables\Filters\SelectFilter::make('category')
                    ->label('Filter Kategori')
                    ->options([
                        'umum' => 'Pertanyaan Umum',
                        'verifikasi' => 'Verifikasi Akun',
                        'legalisir' => 'Permohonan Legalisir',
                        'kegiatan' => 'Usulan Kegiatan & Reuni',
                        'kemitraan' => 'Kemitraan Karir & Beasiswa',
                        'donasi' => 'Donasi Almamater',
                        'lainnya' => 'Hal Lainnya',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->label('Lihat'),

                Tables\Actions\Action::make('mark_as_read')
                    ->label('Tandai Dibaca')
                    ->icon('heroicon-o-check-circle')
                    ->color('warning')
                    ->visible(fn (ContactMessage $record): bool => $record->status === 'unread')
                    ->action(function (ContactMessage $record): void {
                        $record->update(['status' => 'read']);
                        Notification::make()
                            ->title('Pesan Ditandai Telah Dibaca')
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('reply_email')
                    ->label('Balas Email')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->color('success')
                    ->url(fn (ContactMessage $record): string => "mailto:{$record->email}?subject=Tanggapan%20IKAMAYOGA:%20" . rawurlencode($record->subject))
                    ->openUrlInNewTab(),

                Tables\Actions\Action::make('mark_as_spam')
                    ->label('Tandai Spam')
                    ->icon('heroicon-o-shield-exclamation')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (ContactMessage $record): bool => $record->status !== 'spam')
                    ->action(function (ContactMessage $record): void {
                        $record->update(['status' => 'spam']);
                        Notification::make()
                            ->title('Pesan Dipindahkan ke Spam')
                            ->danger()
                            ->send();
                    }),

                Tables\Actions\EditAction::make()
                    ->label('Ubah Status'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('mark_as_read')
                        ->label('Tandai Telah Dibaca')
                        ->icon('heroicon-o-check-circle')
                        ->color('warning')
                        ->action(fn ($records) => $records->each->update(['status' => 'read'])),

                    Tables\Actions\BulkAction::make('mark_as_spam')
                        ->label('Tandai Sebagai Spam')
                        ->icon('heroicon-o-shield-exclamation')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['status' => 'spam'])),

                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactMessages::route('/'),
        ];
    }
}
