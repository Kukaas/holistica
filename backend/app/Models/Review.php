<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Review extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = [
        'protocol_id',
        'user_id',
        'rating',
        'comment',
    ];

    public function protocol()
    {
        return $this->belongsTo(Protocol::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function votes()
    {
        return $this->morphMany(Vote::class , 'votable');
    }
}
