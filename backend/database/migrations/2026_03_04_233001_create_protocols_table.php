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
        Schema::create('protocols', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('content');
            $table->foreignUuid('author_id')->constrained('users')->onDelete('cascade');
            $table->json('tags')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('published');
            $table->float('avg_rating', 3, 2)->default(0);
            $table->integer('discussion_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('protocols');
    }
};
