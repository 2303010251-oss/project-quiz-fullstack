<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Quiz;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    public function index()
    {
        return response()->json(Participant::all());
    }

    public function store(Request $request)
{
    $request->validate([
        'quiz_id' => 'required|exists:quizzes,id',
        'name' => 'required'
    ]);

    $participant = Participant::create([
        'quiz_id' => $request->quiz_id,
        'name' => $request->name
    ]);

    return response()->json([
        'message' => 'Peserta berhasil ditambahkan',
        'data' => $participant
    ], 201);
}

    public function update(Request $request, Participant $participant)
    {
        $participant->update($request->all());

        return response()->json([
            'message' => 'Peserta berhasil diupdate',
            'data' => $participant
        ]);
    }

    public function destroy(Participant $participant)
    {
        $participant->delete();

        return response()->json([
            'message' => 'Peserta berhasil dihapus'
        ]);
    }

    public function joinByPin(Request $request)
    {
        $request->validate([
            'pin' => 'required',
            'name' => 'required'
        ]);

        $quiz = Quiz::where('pin', $request->pin)->first();

        if (!$quiz) {
            return response()->json([
                'message' => 'PIN tidak ditemukan'
            ], 404);
        }

        $participant = Participant::create([
            'quiz_id' => $quiz->id,
            'name' => $request->name
        ]);

        return response()->json([
            'message' => 'Berhasil bergabung',
            'data' => $participant
        ], 201);
    }
}