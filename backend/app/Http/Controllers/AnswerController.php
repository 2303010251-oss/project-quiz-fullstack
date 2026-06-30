<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use Illuminate\Http\Request;

class AnswerController extends Controller
{
    public function index()
    {
        return response()->json(Answer::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'participant_id' => 'required|exists:participants,id',
            'question_id'   => 'required|exists:questions,id',
            'answer'        => 'required|in:A,B,C,D',
        ]);

        $answer = Answer::create([
            'participant_id' => $request->participant_id,
            'question_id'    => $request->question_id,
            'answer'         => $request->answer,
        ]);

        return response()->json([
            'message' => 'Jawaban berhasil disimpan',
            'data'    => $answer,
        ], 201);
    }

    public function show(Answer $answer)
    {
        return response()->json($answer);
    }

    public function update(Request $request, Answer $answer)
    {
        $request->validate([
            'answer' => 'required|in:A,B,C,D',
        ]);

        $answer->update([
            'answer' => $request->answer,
        ]);

        return response()->json([
            'message' => 'Jawaban berhasil diupdate',
            'data'    => $answer,
        ]);
    }

    public function destroy(Answer $answer)
    {
        $answer->delete();

        return response()->json([
            'message' => 'Jawaban berhasil dihapus'
        ]);
    }

    public function submit(Request $request)
    {
        $request->validate([
            'participant_id' => 'required|exists:participants,id',
            'question_id'   => 'required|exists:questions,id',
            'answer'        => 'required|in:A,B,C,D',
        ]);

        $answer = Answer::updateOrCreate(
            [
                'participant_id' => $request->participant_id,
                'question_id'    => $request->question_id,
            ],
            [
                'answer' => $request->answer,
            ]
        );

        return response()->json([
            'message' => 'Jawaban berhasil dikirim',
            'data'    => $answer,
        ]);
    }
}