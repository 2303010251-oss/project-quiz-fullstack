<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\LeaderboardController;

// Login
Route::post('/login', [AuthController::class, 'login']);

// Quiz
Route::apiResource('quizzes', QuizController::class);

// Question
Route::apiResource('questions', QuestionController::class);

// Participant
Route::apiResource('participants', ParticipantController::class);

// Answer
Route::apiResource('answers', AnswerController::class);

// Result
Route::apiResource('results', ResultController::class);

// Leaderboard
Route::apiResource('leaderboards', LeaderboardController::class);

// Join Quiz
Route::post('/join', [ParticipantController::class, 'joinByPin']);

// Submit Jawaban
Route::post('/submit-answer', [AnswerController::class, 'submit']);

// Leaderboard berdasarkan Quiz
Route::get('/leaderboard/{quiz}', [LeaderboardController::class, 'show']);