<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('albums', function (Blueprint $table) {
            $table->string('category')->nullable()->after('slug');
            $table->date('event_date')->nullable()->after('category');
            $table->jsonb('photos')->nullable()->after('cover_image');
            $table->unsignedInteger('photo_count')->default(0)->after('photos');
            $table->boolean('is_featured')->default(false)->after('photo_count');
            $table->string('status')->default('published')->after('is_featured');

            $table->index('category');
            $table->index('is_featured');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('albums', function (Blueprint $table) {
            $table->dropIndex(['category']);
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['status']);

            $table->dropColumn([
                'category',
                'event_date',
                'photos',
                'photo_count',
                'is_featured',
                'status',
            ]);
        });
    }
};
