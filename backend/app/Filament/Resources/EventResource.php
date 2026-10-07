<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EventResource\Pages;
use App\Filament\Resources\EventResource\RelationManagers;
use App\Models\Event;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class EventResource extends Resource
{
    protected static ?string $model = Event::class;

    protected static ?string $navigationGroup = 'Agenda & Kegiatan';

    protected static ?string $navigationLabel = 'Agenda & Reuni';

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('category_id')
                    ->relationship('category', 'name')
                    ->required(),
                Forms\Components\TextInput::make('created_by')
                    ->required(),
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('cover_image')
                    ->label('Foto Sampul Kegiatan')
                    ->image()
                    ->disk('public')
                    ->directory('events/covers')
                    ->visibility('public')
                    ->imageEditor(),
                Forms\Components\TextInput::make('location')
                    ->maxLength(255),
                Forms\Components\DateTimePicker::make('start_at')
                    ->required(),
                Forms\Components\DateTimePicker::make('end_at'),
                Forms\Components\DateTimePicker::make('registration_start_at'),
                Forms\Components\DateTimePicker::make('registration_end_at'),
                Forms\Components\TextInput::make('max_participants')
                    ->numeric(),
                Forms\Components\TextInput::make('status')
                    ->required()
                    ->maxLength(255)
                    ->default('draft'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image')
                    ->label('Sampul')
                    ->circular()
                    ->disk('public')
                    ->defaultImageUrl(asset('images/doc-baksos.jpg'))
                    ->checkFileExistence(false)
                    ->getStateUsing(function (Event $record): ?string {
                        if (empty($record->cover_image)) {
                            return null;
                        }

                        if (str_starts_with($record->cover_image, 'http://') || str_starts_with($record->cover_image, 'https://')) {
                            return $record->cover_image;
                        }

                        if (str_starts_with($record->cover_image, '/images/') || str_starts_with($record->cover_image, 'images/')) {
                            return asset(ltrim($record->cover_image, '/'));
                        }

                        return asset('storage/' . ltrim($record->cover_image, '/'));
                    }),
                Tables\Columns\TextColumn::make('title')
                    ->label('Judul Kegiatan')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Kategori')
                    ->badge(),
                Tables\Columns\TextColumn::make('location')
                    ->searchable(),
                Tables\Columns\TextColumn::make('start_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('end_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('registration_start_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('registration_end_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('max_participants')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
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
            'index' => Pages\ListEvents::route('/'),
            'create' => Pages\CreateEvent::route('/create'),
            'edit' => Pages\EditEvent::route('/{record}/edit'),
        ];
    }
}
