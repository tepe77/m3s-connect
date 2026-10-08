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
        Schema::table('testimonials', function (Blueprint $table) {
            $table->uuid('user_id')->nullable()->change();
            $table->string('author_name')->nullable()->after('user_id');
            $table->string('author_avatar')->nullable()->after('author_name');
            $table->string('graduation_year')->nullable()->after('author_avatar');
            $table->unsignedTinyInteger('rating')->default(5)->after('company');
            $table->boolean('is_featured')->default(false)->after('rating');

            $table->index('is_featured');
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['rating']);

            $table->dropColumn([
                'author_name',
                'author_avatar',
                'graduation_year',
                'rating',
                'is_featured',
            ]);

            $table->uuid('user_id')->nullable(false)->change();
        });
    }
};
