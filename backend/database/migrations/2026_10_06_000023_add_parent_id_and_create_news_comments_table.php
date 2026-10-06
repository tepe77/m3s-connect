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
        // 1. Add parent_id to news_categories to support subcategories if not exists
        if (!Schema::hasColumn('news_categories', 'parent_id')) {
            Schema::table('news_categories', function (Blueprint $table) {
                $table->foreignUuid('parent_id')->nullable()->after('id')->constrained('news_categories')->nullOnDelete();
            });
        }

        // 2. Add tags and media_gallery to news if not exists
        if (!Schema::hasColumn('news', 'tags')) {
            Schema::table('news', function (Blueprint $table) {
                $table->json('tags')->nullable()->after('status');
                $table->json('content_images')->nullable()->after('cover_image');
            });
        }

        // 3. Create WordPress-style news_comments table
        if (!Schema::hasTable('news_comments')) {
            Schema::create('news_comments', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignUuid('news_id')->constrained('news')->cascadeOnDelete();
                $table->foreignUuid('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->uuid('parent_id')->nullable();
                $table->string('author_name');
                $table->string('author_email');
                $table->string('author_url')->nullable();
                $table->text('content');
                $table->boolean('is_approved')->default(true);
                $table->string('ip_address', 45)->nullable();
                $table->string('user_agent')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index(['news_id', 'is_approved', 'created_at']);
            });

            Schema::table('news_comments', function (Blueprint $table) {
                $table->foreign('parent_id')->references('id')->on('news_comments')->cascadeOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_comments');

        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn(['tags', 'content_images']);
        });

        Schema::table('news_categories', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn('parent_id');
        });
    }
};
