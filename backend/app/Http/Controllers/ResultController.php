<?php

namespace App\Http\Controllers;

use App\Models\Result;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function index()
    {
        return response()->json(Result::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'participant_id' => 'required|exists:participants,id',
            'score' => 'required|integer'
        ]);

        $result = Result::create([
            'quiz_id' => $request->quiz_id,
            'participant_id' => $request->participant_id,
            'score' => $request->score,
        ]);

        return response()->json([
            'message' => 'Hasil berhasil disimpan',
            'data' => $result
        ], 201);
    }

    public function show(Result $result)
    {
        return response()->json($result);
    }

    public function update(Request $request, Result $result)
    {
        $request->validate([
            'score' => 'required|integer'
        ]);

        $result->update([
            'score' => $request->score
        ]);

        return response()->json([
            'message' => 'Hasil berhasil diupdate',
            'data' => $result
        ]);
    }

    public function destroy(Result $result)
    {
        $result->delete();

        return response()->json([
            'message' => 'Hasil berhasil dihapus'
        ]);
    }
}