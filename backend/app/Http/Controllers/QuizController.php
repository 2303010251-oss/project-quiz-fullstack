<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QuizController extends Controller
{
    // Menampilkan semua quiz
    public function index()
    {
        return response()->json(Quiz::all());
    }

    // Menambahkan quiz
   public function store(Request $request)
{
    $request->validate([
        'title' => 'required'
    ]);

    $quiz = Quiz::create([
        'user_id' => 1,
        'title' => $request->title,
        'pin' => rand(100000,999999),
        'status' => 'draft'
    ]);

    return response()->json([
        'message' => 'Quiz berhasil dibuat',
        'data' => $quiz
    ], 201);
}
    // Update quiz
    public function update(Request $request, Quiz $quiz)
    {
        $quiz->update($request->all());

        return response()->json([
            'message'=>'Quiz berhasil diupdate',
            'data'=>$quiz
        ]);
    }

    // Hapus quiz
    public function destroy(Quiz $quiz)
    {
        $quiz->delete();

        return response()->json([
            'message'=>'Quiz berhasil dihapus'
        ]);
    }
}