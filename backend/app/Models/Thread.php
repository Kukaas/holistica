<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    protected $fillable = [
        'protocol_id',
        'user_id',
        'title',
        'status',
    ];

    public function protocol()
    {
        return $this->belongsTo(Protocol::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
