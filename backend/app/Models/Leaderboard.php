<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Leaderboard extends Model
{
    protected $fillable = [
        'quiz_id',
        'participant_id',
        'score',
        'rank'
    ];
}