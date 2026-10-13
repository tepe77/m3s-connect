<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationGroup = 'Manajemen Pengguna';

    protected static ?string $navigationLabel = 'Semua Pengguna';

    protected static ?string $navigationIcon = 'heroicon-o-users';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Akun Pengguna')
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
                        Forms\Components\Select::make('role')
                            ->label('Peran (Role)')
                            ->options([
                                'alumni' => 'Alumni',
                                'moderator' => 'Moderator',
                                'admin' => 'Administrator',
                                'guest' => 'Tamu (Guest)',
                            ])
                            ->required()
                            ->default('alumni')
                            ->native(false),
                        Forms\Components\Select::make('status')
                            ->label('Status Akun')
                            ->options([
                                'active' => 'Aktif (Active)',
                                'pending' => 'Menunggu Verifikasi (Pending)',
                                'suspended' => 'Ditangguhkan (Suspended)',
                                'inactive' => 'Tidak Aktif (Inactive)',
                            ])
                            ->required()
                            ->default('active')
                            ->native(false),
                        Forms\Components\TextInput::make('password')
                            ->label('Kata Sandi')
                            ->password()
                            ->dehydrateStateUsing(fn ($state) => \Illuminate\Support\Facades\Hash::make($state))
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->maxLength(255)
                            ->helperText('Kosongkan jika tidak ingin mengubah kata sandi.'),
                        Forms\Components\DateTimePicker::make('email_verified_at')
                            ->label('Waktu Verifikasi Email'),
                        Forms\Components\DateTimePicker::make('last_login_at')
                            ->label('Login Terakhir')
                            ->disabled(),
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
                Tables\Columns\TextColumn::make('role')
                    ->label('Peran')
                    ->badge()
                    ->color(fn ($state): string => match (is_object($state) ? $state->value : $state) {
                        'admin' => 'danger',
                        'moderator' => 'warning',
                        'alumni' => 'success',
                        default => 'gray',
                    })
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($state): string => match (is_object($state) ? $state->value : $state) {
                        'active' => 'success',
                        'pending' => 'warning',
                        'suspended' => 'danger',
                        default => 'gray',
                    })
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Terdaftar')
                    ->dateTime('d M Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('profile.graduation_year')
                    ->label('Angkatan')
                    ->badge()
                    ->color('info')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('profile.alumni_identifier')
                    ->label('NPA')
                    ->fontFamily('mono')
                    ->searchable()
                    ->copyable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->label('Dihapus')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('role')
                    ->label('Filter Peran')
                    ->options([
                        'admin' => 'Administrator',
                        'moderator' => 'Moderator',
                        'alumni' => 'Alumni',
                        'guest' => 'Tamu (Guest)',
                    ]),
                Tables\Filters\SelectFilter::make('status')
                    ->label('Filter Status')
                    ->options([
                        'active' => 'Aktif',
                        'pending' => 'Menunggu Verifikasi',
                        'suspended' => 'Ditangguhkan',
                        'inactive' => 'Tidak Aktif',
                    ]),
                Tables\Filters\TrashedFilter::make()
                    ->label('Status Penghapusan (Sampah)'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ActionGroup::make([
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

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
