<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProtocolController;
use App\Http\Controllers\Api\ThreadController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\VoteController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Protocols
Route::apiResource('protocols', ProtocolController::class);

// Threads
Route::apiResource('threads', ThreadController::class);

// Comments
Route::apiResource('comments', CommentController::class);

// Reviews
Route::apiResource('reviews', ReviewController::class);

// Votes
Route::post('votes', [VoteController::class , 'store']);
