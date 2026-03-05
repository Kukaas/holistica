<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProtocolController;
use App\Http\Controllers\Api\ThreadController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\AuthController;

// Auth Routes
Route::post('register', [AuthController::class , 'register']);
Route::post('login', [AuthController::class , 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class , 'logout']);
    Route::get('me', [AuthController::class , 'me']);

    // Protected Engagement Routes
    Route::post('threads', [ThreadController::class , 'store']);
    Route::post('comments', [CommentController::class , 'store']);
    Route::post('reviews', [ReviewController::class , 'store']);
    Route::post('votes', [VoteController::class , 'store']);
});

// Public Read Routes
Route::get('protocols', [ProtocolController::class , 'index']);
Route::get('protocols/{protocol}/threads', [ProtocolController::class , 'threads']);
Route::get('protocols/{protocol}/reviews', [ProtocolController::class , 'reviews']);
Route::get('protocols/{protocol}', [ProtocolController::class , 'show']);
Route::get('threads', [ThreadController::class , 'index']);
Route::get('threads/{thread}/comments', [ThreadController::class , 'comments']);
Route::get('threads/{thread}', [ThreadController::class , 'show']);
Route::get('comments', [CommentController::class , 'index']);
Route::get('reviews', [ReviewController::class , 'index']);
