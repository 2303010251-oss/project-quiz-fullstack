<?php

namespace App\Http\Controllers;

use App\Models\Leaderboard;
use App\Models\Participant;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index()
    {
        return response()->json(
            Leaderboard::orderBy('rank')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'participant_id' => 'required|exists:participants,id',
            'score' => 'required|integer',
            'rank' => 'required|integer'
        ]);

        $leaderboard = Leaderboard::create([
            'quiz_id' => $request->quiz_id,
            'participant_id' => $request->participant_id,
            'score' => $request->score,
            'rank' => $request->rank
        ]);

        return response()->json([
            'message' => 'Leaderboard berhasil ditambahkan',
            'data' => $leaderboard
        ], 201);
    }

    public function show(string $quiz)
    {
        $leaderboard = Leaderboard::where('quiz_id', $quiz)
            ->orderBy('rank')
            ->get();

        return response()->json($leaderboard);
    }

    public function update(Request $request, string $id)
    {
        $leaderboard = Leaderboard::findOrFail($id);

        $leaderboard->update($request->all());

        return response()->json([
            'message' => 'Leaderboard berhasil diupdate',
            'data' => $leaderboard
        ]);
    }

    public function destroy(string $id)
    {
        $leaderboard = Leaderboard::findOrFail($id);

        $leaderboard->delete();

        return response()->json([
            'message' => 'Leaderboard berhasil dihapus'
        ]);
    }
}