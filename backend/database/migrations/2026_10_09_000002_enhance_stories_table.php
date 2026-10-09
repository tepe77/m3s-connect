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
        Schema::table('stories', function (Blueprint $table) {
            $table->uuid('user_id')->nullable()->change();
            $table->string('author_name')->nullable()->after('user_id');
            $table->string('author_avatar')->nullable()->after('author_name');
            $table->string('graduation_year')->nullable()->after('author_avatar');
            $table->string('profession')->nullable()->after('graduation_year');
            $table->string('company')->nullable()->after('profession');
            $table->string('category')->nullable()->after('company');
            $table->unsignedSmallInteger('reading_time')->default(4)->after('category');
            $table->boolean('is_featured')->default(false)->after('reading_time');

            $table->index('is_featured');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['category']);

            $table->dropColumn([
                'author_name',
                'author_avatar',
                'graduation_year',
                'profession',
                'company',
                'category',
                'reading_time',
                'is_featured',
            ]);

            $table->uuid('user_id')->nullable(false)->change();
        });
    }
};
