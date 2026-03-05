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
        Schema::table('protocols', function (Blueprint $table) {
            $table->softDeletes(); });
        Schema::table('threads', function (Blueprint $table) {
            $table->softDeletes(); });
        Schema::table('comments', function (Blueprint $table) {
            $table->softDeletes(); });
        Schema::table('reviews', function (Blueprint $table) {
            $table->softDeletes(); });
        Schema::table('votes', function (Blueprint $table) {
            $table->softDeletes(); });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('protocols', function (Blueprint $table) {
            $table->dropSoftDeletes(); });
        Schema::table('threads', function (Blueprint $table) {
            $table->dropSoftDeletes(); });
        Schema::table('comments', function (Blueprint $table) {
            $table->dropSoftDeletes(); });
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropSoftDeletes(); });
        Schema::table('votes', function (Blueprint $table) {
            $table->dropSoftDeletes(); });
    }
};
