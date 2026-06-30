<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = [
        'participant_id',
        'question_id',
        'answer'
    ];

    public function participant()
    {
        return $this->belongsTo(Participant::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}