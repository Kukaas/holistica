<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = [
        'user_id',
        'votable_id',
        'votable_type',
        'value',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function votable()
    {
        return $this->morphTo();
    }
}
